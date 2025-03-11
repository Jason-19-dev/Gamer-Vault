import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCheckbox, IonContent, IonInput, IonInputPasswordToggle, IonText, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  // standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonInputPasswordToggle,
    IonInput,
    IonCheckbox,
    IonText,
    ReactiveFormsModule,

  ]
})
export class SigninPage implements OnInit {

  form_signin: FormGroup;;

  constructor(private fb: FormBuilder, private router: Router, private alertController: AlertController) {
    this.form_signin = this.fb.group(
      {
        nameUser: ['', [Validators.required, Validators.maxLength(6)]],
        email: ['', [Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
        password_confirm: ['', [Validators.required]],

      }
    );
  }

  ngOnInit() {
    addIcons(icons)

  }

  signin() {
    if (this.form_signin.invalid) {
      return
    }
    // values form
    const { nameUser: name, password: pass} = this.form_signin.value

    this.alert("Welcome!" + " " + name.toUpperCase(), "", "")
    this.router.navigateByUrl('restaurant/home');
    console.table(this.form_signin.value)
  }



  // Message 
  async alert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
