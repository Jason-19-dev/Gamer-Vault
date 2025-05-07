import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/services/cart/cart.service';
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
//import { ModalController, NavController } from '@ionic/angular';
import { PaymentMethodComponent } from 'src/app/modals/payment-method/payment-method.component';
import {  HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import { ModalController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
//import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from "src/services/orders/orders.service";
//import { UserService } from "src/services/user/user.service";
import { Router } from "@angular/router";
import { PaymentConfirmationComponent } from 'src/app/modals/payment-confirmation/payment-confirmation.component';
import { WalletService } from 'src/services/wallet/wallet.service';
import { Wallet } from 'src/types';
import { UserService, type User } from "src/services/user/user.service"
import { IonCheckbox, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Capacitor } from "@capacitor/core";
import { BiometricService } from "src/services/biometric/biometric.service";
import { NotificationsService } from "src/services/notifications/notifications.service";

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [CommonModule,FormsModule,HttpClientModule,IonContent,IonHeader,IonToolbar,IonTitle,TabsPagesPage,IonBackButton,IonButtons,IonCheckbox,IonButton,IonIcon,
]

})
export class CheckoutPage implements OnInit {
  currentUser: User | null = null
  walletUser: Wallet [] = [];
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
  paymentSuccessful = false;
  discount = 0

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private http: HttpClient,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
  this.cartItems = this.cartService.getCartItems();
  this.subtotal = this.cartService.getTotal();
  this.roundedTotal = Math.ceil(this.subtotal);
  this.savings = this.roundedTotal - this.subtotal;
  this.finalTotal = this.roundedTotal;
  this.originalTotal = this.finalTotal;
  this.getUserBalance();
  this.currentUser = this.userService.getCurrentUser()
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
    const user_id = await this.userService.getCurrentUserID();

    if (!user_id) {
      console.error("No user ID found. Cannot load orders.");
      return;
    }

    this.walletService.getWalletBalance(user_id).subscribe({
      next: (res) => {
        this.walletUser = res;
        this.walletBalance = res.balance;
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
    let errorMessage = '';


    // if (Capacitor.getPlatform() === 'android') {
    //   const biometricSuccess = await this.biometricService.verifyIdentity('Confirmar pago', 'Autenticación biométrica');

    // if (!biometricSuccess) {
    //   await this.showErrorModal('Autenticación biométrica fallida o cancelada.');
    //   this.loading = false;

    //   return;
    // }}

    try {
      const userId = await this.userService.getCurrentUserID();
      if (!userId) throw new Error("User ID not found.");

      // Caso 1: Wallet + Card (combinado)
      if (this.payWithWallet && this.savedCard) {
        this.walletService.getWalletBalance(userId).subscribe(
          async (walletData: any) => {
            const walletBalance = walletData.balance;
            const walletDiscount = Math.min(walletBalance, this.originalTotal);;

            console.log(`Descuento de Wallet: $${walletDiscount}`);
            console.log(`Total a pagar con tarjeta: $${this.finalTotal}`);

            this.walletService.deductWalletBalance(userId, walletDiscount).subscribe(
              async (walletRes: any) => {
                if (walletRes.error) {
                  await this.showErrorModal(walletRes.error);
                  this.loading = false;
                  return;
                }

                // Si aún hay saldo a pagar, usa la tarjeta
                if (this.finalTotal > 0) {
                  const payload = {
                    card_number: this.savedCard.number,
                    cvv: this.savedCard.cvc,
                    expiration: this.savedCard.expiry,
                    amount: this.finalTotal
                  };

                  try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const response: any = await this.http
                      .post('https://pq5e5sx8tb.execute-api.us-east-1.amazonaws.com/dev/pago', payload)
                      .toPromise();

                    if (response.status === 'success') {
                      this.paymentSuccessful = true;
                    } else {
                      await this.showErrorModal(response.message || "Card payment failed");
                      this.loading = false;
                      return;
                    }
                  } catch (error: any) {
                    errorMessage = error.error?.message || error.message || "Card payment failed";
                    await this.showErrorModal(errorMessage);
                    this.loading = false;
                    return;
                  }
                }

                // Crear orden
                const order_payload = {
                  user_id: userId,
                  total: this.finalTotal,
                  savings: this.savings,
                  status: 'pending',
                  description: this.cartItems,
                  payment_method: this.enmascararTarjeta(this.savedCard.number)
                };

                this.ordersService.create_new_order(order_payload).subscribe({
                  next: async (res) => {
                    this.cartService.clearCart();
                    await this.notificationsService.notifyPurchaseWithSavings(this.savings);
                    await this.showSuccessModal();
                  },
                  error: async () => {
                    await this.showErrorModal("Failed to create order. Please try again.");
                  }
                });

                this.loading = false;
              },
              async (err) => {
                await this.showErrorModal("Wallet deduction failed: " + err.message);
                this.loading = false;
              }
            );
          },
          async (err) => {
            await this.showErrorModal("Failed to fetch wallet balance: " + err.message);
            this.loading = false;
          }
        );
      }

      // Caso 2: Solo Wallet
      else if (this.payWithWallet) {
        this.walletService.getWalletBalance(userId).subscribe(
          async (walletData: any) => {
            this.discount = Math.min(walletData.balance, this.originalTotal);
            this.finalTotal = this.originalTotal - this.discount;

            if (this.finalTotal > 0) {
              await this.showErrorModal("Insufficient wallet balance to complete the purchase.");
              this.loading = false;
              return;
            }

            this.walletService.deductWalletBalance(userId, this.originalTotal).subscribe(
              async (response: any) => {
                if (response.error) {
                  await this.showErrorModal(response.error);
                  this.loading = false;
                  return;
                }

                this.paymentSuccessful = true;
                const order_payload = {
                  user_id: userId,
                  total: this.finalTotal,
                  savings: this.savings,
                  status: 'pending',
                  description: this.cartItems
                };

                this.ordersService.create_new_order(order_payload).subscribe({
                  next: async (res) => {
                    this.cartService.clearCart();
                    await this.showSuccessModal();
                  },
                  error: async () => {
                    await this.showErrorModal("Failed to create order. Please try again.");
                  }
                });

                this.loading = false;
              },
              async (error: any) => {
                await this.showErrorModal("Wallet payment failed: " + error.message);
                this.loading = false;
              }
            );
          },
          async (error: any) => {
            await this.showErrorModal("Failed to fetch wallet balance: " + error.message);
            this.loading = false;
          }
        );
      }

      // Caso 3: Solo Tarjeta
      else if (this.savedCard) {
        console.log("entre");
        const payload = {
          card_number: this.savedCard.number,
          cvv: this.savedCard.cvc,
          expiration: this.savedCard.expiry,
          amount: this.originalTotal
        };

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response: any = await this.http
            .post('https://pq5e5sx8tb.execute-api.us-east-1.amazonaws.com/dev/pago', payload)
            .toPromise();

          if (response.status === 'success') {
            this.paymentSuccessful = true;

            const order_payload = {
              user_id: userId,
              total: this.originalTotal,
              savings: this.savings,
              status: 'pending',
              description: this.cartItems,
              payment_method: this.enmascararTarjeta(this.savedCard.number)
            };

            this.ordersService.create_new_order(order_payload).subscribe({
              next: async (res) => {
                this.cartService.clearCart();
                await this.showSuccessModal();
                this.notificationsService.notifyPurchaseWithSavings(this.savings);
              },
              error: async () => {
                await this.showErrorModal("Failed to create order. Please try again.");
              }
            });
          } else {
            await this.showErrorModal(response.message || 'Payment failed');
          }
        } catch (error: any) {
          errorMessage = error.error?.message || 'Error processing payment: ' + error.message;
          await this.showErrorModal(errorMessage);
        }
        console.log("sali");
        this.loading = false;
      }

      // Caso 4: Ningún método seleccionado
      else {
        await this.showErrorModal("No payment method selected.");
        this.loading = false;
      }
    } catch (error: any) {
      await this.showErrorModal(error.message);
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
      initialBreakpoint: 0.6,
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
      initialBreakpoint: 0.6,
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
      this.discount = Math.min(this.walletBalance, this.originalTotal);
      this.finalTotal = this.originalTotal - this.discount;
      //console.log(`Aplicando descuento de Wallet: -$${discount}`);
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
  // enmascarar tarjeta el número
  enmascararTarjeta(numCard: string): string {
    const last = numCard.slice(-4);
    const enmascarar = '*'.repeat(numCard.length - 4);
    return enmascarar+ last;
  }
}