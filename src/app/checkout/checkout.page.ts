import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/services/cart/cart.service';
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { ModalController } from '@ionic/angular';
import { PaymentMethodComponent } from 'src/app/modals/payment-method/payment-method.component';
import { PaymentConfirmationComponent } from 'src/app/modals/payment-confirmation/payment-confirmation.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from "src/services/orders/orders.service";
import { UserService } from "src/services/user/user.service";
import { WalletService } from 'src/services/wallet/wallet.service'; // asegúrate de importar
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
  userId: string = '';
  walletBalance = 1;
  userName = 'Carlos'; // Aquí podrías traer el nombre dinámicamente del usuario
originalTotal: number = 0; // Para guardar el total sin descuentos


  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private walletService: WalletService,

  ) {}

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

  async getUserBalance(){
    console.log("in");
    const user_id = await this.userService.getCurrentUserID();
    console.log("value : "+user_id);

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

async  payNowx() {
 const modal = await this.modalCtrl.create({
    component: PaymentConfirmationComponent,
    breakpoints: [0, 1],
    initialBreakpoint: 1,
    showBackdrop: true,
    //backdropDismiss: false, // Para que no se cierre si el usuario toca fuera
  });
  await modal.present();
}

async payNow() {
  if (!this.savedCard) {
    console.log('No card selected');
    return;
  }

  const payload = {
    card_number: this.savedCard.number,
    cvv: this.savedCard.cvc, // reemplaza con el real si lo tienes
    expiration: this.savedCard.expiry,
    amount: this.finalTotal,
  };



  console.log(payload)
  try {
    const response: any = await this.http.post(
      'https://pq5e5sx8tb.execute-api.us-east-1.amazonaws.com/dev/pago',
      payload
    ).toPromise();

    if (response.status === 'success') {
      // Mostrar modal de éxito

      console.log("tarjeta tiene suficiente")

      const order_payload = {
        user_id: await this.userService.getCurrentUserID(),
        total: this.finalTotal,
        savings: this.savings,
        status: 'pending',
        description: this.cartItems
      };
      console.log(this.savings);
      this.ordersService.create_new_order(order_payload).subscribe({
        next: (res) => {
          console.log("res new order", res);
          this.cartService.clearCart();
          this.showSuccessModal();
        },
        error: (err) => {
          console.error("API ERROR", err);
        }
      })

    } else {
      alert('Payment failed: ' + response.message);
    }
  } catch (error) {
    console.error(error);
    alert('Error processing payment :c');
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
      cvc : data.cvc
    };
    this.calculateTotals();
  }
  console.log(data);
}

async showSuccessModal() {
  const modal = await this.modalCtrl.create({
    component: PaymentConfirmationComponent,
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



}

