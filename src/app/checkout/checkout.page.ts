import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/services/cart/cart.service';
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { ModalController, NavController } from '@ionic/angular';
import { PaymentMethodComponent } from 'src/app/modals/payment-method/payment-method.component';
import {  HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from "src/services/orders/orders.service";
import { UserService } from "src/services/user/user.service";
import { Router } from "@angular/router";
import { PaymentConfirmationComponent } from 'src/app/modals/payment-confirmation/payment-confirmation.component'; // Import the PaymentConfirmationComponent


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
  loading = false; // Track loading state


  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.subtotal = this.cartService.getTotal();
    this.roundedTotal = Math.ceil(this.subtotal);
    this.savings = this.roundedTotal - this.subtotal;
    this.finalTotal = this.roundedTotal;
  }

  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.roundedTotal = Math.ceil(this.subtotal);
    this.savings = this.roundedTotal - this.subtotal;
    this.finalTotal = this.roundedTotal;

    if (this.cartItems.length === 0) {
      this.subtotal = 0;
      this.roundedTotal = 0;
      this.savings = 0;
      this.finalTotal = 0;
    }
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
    if (!this.savedCard) {
      this.showErrorModal('No card selected. Please add a card.');
      return;
    }

    this.loading = true; // Start loading
    const payload = {
      card_number: this.savedCard.number,
      cvv: this.savedCard.cvc,
      expiration: this.savedCard.expiry,
      amount: this.finalTotal,
    };

    console.log(payload);
    let paymentSuccessful = false; // Track payment status
    let errorMessage = '';
    try {
      // Simulate network delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response: any = await this.http.post(
        'https://pq5e5sx8tb.execute-api.us-east-1.amazonaws.com/dev/pago',
        payload
      ).toPromise();

      if (response.status === 'success') {
        console.log("tarjeta tiene suficiente");
        paymentSuccessful = true;
        const order_payload = {
          user_id: await this.userService.getCurrentUserID(),
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

      } else {
        errorMessage = response.message || 'Payment failed';
        await this.showErrorModal(errorMessage);
      }
    } catch (error: any) {
      console.error(error);
      if (error instanceof HttpErrorResponse) {
        errorMessage = error.error?.message || 'Error processing payment'; // Accede al mensaje del error del backend
      } else {
        errorMessage =  'Error processing payment: ' + error.message;
      }
      await this.showErrorModal(errorMessage);
    } finally {
      this.loading = false;
      if (paymentSuccessful) {
        this.router.navigate(['/home']);
      }
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
  goBack() {
    if (this.router.url === '/checkout') {
      this.navCtrl.back();
    }
  }
}