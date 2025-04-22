import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { navigate } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PaymentConfirmationComponent {

  constructor(private modalCtrl: ModalController, private router: Router) {}

  close() {
    this.modalCtrl.dismiss();
    this.router.navigate(["/home"])

}
}