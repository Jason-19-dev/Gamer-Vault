import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  standalone: true,
  imports: [ IonicModule ]
})
export class TermsConditionsComponent  {

constructor(private modalController: ModalController) {}

  accept() {
    this.modalController.dismiss(null, 'accepted');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
