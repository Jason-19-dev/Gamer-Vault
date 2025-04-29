import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PaymentConfirmationComponent {

  @Input() isSuccess = false;
  @Input() isError = false;
  @Input() errorMessage = '';

  constructor(private modalCtrl: ModalController, private router: Router) {}

  async handleButtonClick() {
    if (this.isSuccess) {
      // Si es éxito: primero cerrar modal y luego navegar
      await this.modalCtrl.dismiss();
      await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa para que se vea el cierre
      this.router.navigate(['/home']);
    } else {
      // Si hay error: solo cerrar modal
      await this.modalCtrl.dismiss();
    }
  }
}
