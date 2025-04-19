import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/services/cart/cart.service';
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { ModalController } from '@ionic/angular';
import { PaymentMethodComponent } from 'src/app/modals/payment-method/payment-method.component';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPagesPage,
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


  constructor(
    private cartService: CartService,
    private modalCtrl: ModalController
  ) {}

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

payNow() {
  const cardData = {
    number: this.cardNumber.replace(/\s+/g, ''),
    holder: this.cardHolder,
    expiry: this.expiry,
  };

  this.modalCtrl.dismiss(cardData);
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
      brand: data.cardType
    };
  }
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


}

