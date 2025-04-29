import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/services/cart/cart.service';
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { ModalController, NavController } from '@ionic/angular';
import { PaymentMethodComponent } from 'src/app/modals/payment-method/payment-method.component';
import {  HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from "src/services/orders/orders.service";
import { UserService } from "src/services/user/user.service";
import { Router } from "@angular/router";
import { PaymentConfirmationComponent } from 'src/app/modals/payment-confirmation/payment-confirmation.component';
import { WalletService } from 'src/services/wallet/wallet.service';
import { Wallet } from 'src/types';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPagesPage
  ],
})
export class CheckoutPage implements OnInit {
  walletUser: Wallet[] = [];
  cartItems: CartItem[] = [];
  subtotal = 0;
  roundedTotal = 0;
  savings = 0;
  finalTotal = 0;
  useSavings = true;
  selectedMethod = '';
  savedCard: any = null;
  cardNumber = '';
  cardHolder = '';
  expiry = '';
  cvc = '';
  loading = false;
  userId: string = '';
  walletBalance = 1;
  userName = 'Carlos';
  originalTotal: number = 0;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private http: HttpClient,
    private walletService: WalletService,
  ) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.subtotal = this.cartService.getTotal();
    this.roundedTotal = Math.ceil(this.subtotal);
    this.savings = this.roundedTotal - this.subtotal;
    this.finalTotal = this.roundedTotal;
    this.originalTotal = this.finalTotal;
    this.getUserBalance();
  }

  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.roundedTotal = Math.ceil(this.subtotal);
    this.savings = this.roundedTotal - this.subtotal;
    this.finalTotal = this.roundedTotal;
    this.originalTotal = this.finalTotal;

    if (this.cartItems.length === 0) {
      this.subtotal = 0;
      this.roundedTotal = 0;
      this.savings = 0;
      this.finalTotal = 0;
      this.originalTotal = 0;
    }
  }

  async getUserBalance() {
    console.log("in");
    const user_id = await this.userService.getCurrentUserID();
    console.log("value : " + user_id);

    if (!user_id) {
      console.error("No user ID found. Cannot load orders.");
      return;
    }
    console.log("pasaste");
    this.walletService.getWalletBalance(user_id).subscribe({
      next: (res) => {
        this.walletUser = res;
        this.walletBalance = res.balance;
        console.log(res);
      },
      error: (err) => {
        console.error("Error loading wallet balance:", err);
      }
    })
  }

  async payNowx() {
    const modal = await this.modalCtrl.create({
      component: PaymentConfirmationComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      showBackdrop: true,
    });
    await modal.present();
  }

  async payNow() {
    this.loading = true;
    let paymentSuccessful = false;
    let errorMessage = '';
    try {
      const userId = await this.userService.getCurrentUserID();
      if (!userId) {
        throw new Error("User ID not found.");
      }

      if (this.payWithWallet) {
        // Get wallet balance and then deduct it.
        this.walletService.getWalletBalance(userId).subscribe(
          async (walletData: any) => {
            const walletBalance = walletData.balance;

            this.walletService.deductWalletBalance(userId, walletBalance).subscribe(
              async (response: any) => {
                if (response.error) {
                  errorMessage = response.error;
                  await this.showErrorModal(errorMessage);
                  this.loading = false;
                  return;
                }
                console.log("deduct response", response);
                paymentSuccessful = true;
                const order_payload = {
                  user_id: userId,
                  total: this.finalTotal,
                  savings: this.savings,
                  status: 'pending',
                  description: this.cartItems
                };
                this.ordersService.create_new_order(order_payload).subscribe({
                  next: async (res) => {
                    console.log("res new order", res);
                    this.cartService.clearCart();
                    await this.showSuccessModal();
                  },
                  error: async (err) => {
                    console.error("API ERROR", err);
                    errorMessage = 'Failed to create order. Please try again.';
                    await this.showErrorModal(errorMessage);
                    paymentSuccessful = false;
                  }
                });
                this.loading = false;
              },
              async (error: any) => {
                console.error("Wallet deduction failed:", error);
                errorMessage = 'Wallet payment failed: ' + error.message;
                await this.showErrorModal(errorMessage);
                this.loading = false;
                paymentSuccessful = false;
              }
            );
          },
          (error: any) => {
            console.error("Failed to fetch wallet balance:", error);
            errorMessage = "Failed to fetch wallet balance: " + error.message;
            this.showErrorModal(errorMessage);
            this.loading = false;
            paymentSuccessful = false;
          }
        );
      } else if (this.savedCard) {
        const payload = {
          card_number: this.savedCard.number,
          cvv: this.savedCard.cvc,
          expiration: this.savedCard.expiry,
          amount: this.finalTotal,
        };
        console.log(payload);

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response: any = await this.http
            .post('https://pq5e5sx8tb.execute-api.us-east-1.amazonaws.com/dev/pago', payload)
            .toPromise();

          if (response.status === 'success') {
            paymentSuccessful = true;
            const order_payload = {
              user_id: userId,
              total: this.finalTotal,
              savings: this.savings,
              status: 'pending',
              description: this.cartItems
            };

            this.ordersService.create_new_order(order_payload).subscribe({
              next: async (res) => {
                console.log("res new order", res);
                this.cartService.clearCart();
                await this.showSuccessModal();
              },
              error: async (err) => {
                console.error("API ERROR", err);
                errorMessage = 'Failed to create order. Please try again.';
                await this.showErrorModal(errorMessage);
                paymentSuccessful = false;
              }
            });
            this.loading = false;
          } else {
            errorMessage = response.message || 'Payment failed';
            await this.showErrorModal(errorMessage);
            this.loading = false;
          }
        } catch (error: any) {
          console.error(error);
          if (error instanceof HttpErrorResponse) {
            errorMessage = error.error?.message || 'Error processing payment';
          } else {
            errorMessage = 'Error processing payment: ' + error.message;
          }
          await this.showErrorModal(errorMessage);
          this.loading = false;
          paymentSuccessful = false;
        }
      } else {
        errorMessage = "No payment method selected"
        await this.showErrorModal(errorMessage);
        this.loading = false;
      }
    } finally {
      this.loading = false;
    }
  }

  async openCardModal() {
    const modal = await this.modalCtrl.create({
      component: PaymentMethodComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1,
      showBackdrop: true,
      cssClass: 'card-full-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.savedCard = {
        number: data.cardNumber,
        holder: data.cardHolder,
        expiry: data.expiry,
        brand: data.cardType,
        cvc: data.cvc
      };
      this.calculateTotals();
    }
    console.log(data);
  }
  async showSuccessModal() {
    const modal = await this.modalCtrl.create({
      component: PaymentConfirmationComponent,
      componentProps: {
        isSuccess: true,
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      showBackdrop: true
    });

    await modal.present();
  }
  async showErrorModal(message: string) {
    const modal = await this.modalCtrl.create({
      component: PaymentConfirmationComponent,
      componentProps: {
        errorMessage: message,
        isError: true
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      showBackdrop: true
    });
    await modal.present();
  }
  selectMethod(method: string) {
    this.selectedMethod = method;

    if (method === 'card') {
      this.openCardModal();
    }
  }

  getCardLogo(type: string): string {
    if (type === 'visa') return 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg';
    if (type === 'mastercard') return 'https://img.icons8.com/color/48/mastercard-logo.png';
    return '';
  }
  formatCardNumber(num: string = ''): string {
    return num.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }
  payWithWallet: boolean = false;

  toggleWalletPayment() {
    console.log('¿Pagar con Wallet?', this.payWithWallet);

    if (this.payWithWallet) {
      const discount = Math.min(this.walletBalance, this.originalTotal);
      this.finalTotal = this.originalTotal - discount;
      console.log(`Aplicando descuento de Wallet: -$${discount}`);
    } else {
      this.finalTotal = this.originalTotal;
      console.log('Descuento de Wallet eliminado.');
    }
  }
  goBack() {
    if (this.router.url === '/checkout') {
      this.navCtrl.back();
    }
  }
}