import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from "src/services/user/user.service"
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule],
})
export class PaymentConfirmationComponent {

  @Input() isSuccess = false;
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() redeemCode: string = 'BW-9837-XPZ5';
  username = this.userService.getCurrentUser()?.username

  constructor(private modalCtrl: ModalController, private router: Router,private userService: UserService) {}

  async handleButtonClick() {
    if (this.isSuccess) {
      console.log("1");
      // Si es éxito: primero cerrar modal y luego navegar
      await this.modalCtrl.dismiss();
      await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa para que se vea el cierre
      this.router.navigate(['/home']);
    } else {
      // Si hay error: solo cerrar modal
      await this.modalCtrl.dismiss();
    }
  }
  async goToWallet() {
    if (this.isSuccess) {
      console.log("2");
      await this.modalCtrl.dismiss();
      await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa para que se vea el cierre
      this.router.navigate(['/wallet']);
    } else {
      await this.modalCtrl.dismiss();
    }
  }



}
