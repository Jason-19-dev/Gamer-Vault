import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PaymentConfirmationComponent {

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();

}
}