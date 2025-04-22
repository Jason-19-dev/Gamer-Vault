import { Component ,ViewEncapsulation} from '@angular/core';
import { HttpClient } from '@angular/common/http';
encapsulation: ViewEncapsulation.None
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  ModalController,
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-payment-modal',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  standalone: true,
   encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon
  ]
})
export class PaymentMethodComponent {
  cardNumber = '';
  cardHolder = '';
  expiry = '';
  cvc = '';

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  payNowC() {
    console.log('Procesando pago:', {
      cardNumber: this.cardNumber,
      cardHolder: this.cardHolder,
      expiry: this.expiry,
      cvc: this.cvc
    });
    this.modalCtrl.dismiss({ success: true });
  }

payNow() {
  const cardData = {
    cardNumber: this.cardNumber,
    cardHolder: this.cardHolder,
    expiry: this.expiry,
    cardType: this.getCardType(),
    cvc: this.cvc
  };

  this.modalCtrl.dismiss(cardData); // 👈 envía los datos al cerrar
}




  formatCardNumber(num: string): string {
    return num.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

getCardType(): string {
  const number = this.cardNumber.replace(/\s+/g, '');

  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6(?:011|5)/.test(number)) return 'discover';

  return 'unknown';
}



  getCardLogo(): string {
    const type = this.getCardType();
    if (type === 'visa') return 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg';
    if (type === 'mastercard') return 'https://img.icons8.com/color/48/mastercard-logo.png';
    return '';
  }
}
