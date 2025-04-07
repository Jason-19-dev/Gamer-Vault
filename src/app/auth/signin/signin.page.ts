import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCheckbox, IonContent, IonInput, IonInputPasswordToggle, IonText, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  encapsulation: ViewEncapsulation.None,
  // standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonCheckbox,
    IonText,
    ReactiveFormsModule,
    IonDatetime,
    IonInput

  ]
})
export class SigninPage implements OnInit {

  form_signin: FormGroup;;

  constructor(private fb: FormBuilder, private router: Router, private alertController: AlertController, private authService: AuthService) {
    this.form_signin = this.fb.group(
      {
        nameUser: ['', [Validators.required, Validators.maxLength(25)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        password_confirm: ['', [Validators.required]],
        dateOfBirth:[]

      }
    );
  }

  ngOnInit() {
    addIcons(icons)

  }

  signin() {
    if (this.form_signin.invalid) {
      this.alert('Invalid information', '', 'Please check your information');
      return
    }
    // values form
    const formData = this.form_signin.value;

    this.authService.register(formData).subscribe({
      next: (res) => {
        this.alert('Successful registration', '', `Welcome ${formData.nameUser.toUpperCase()}!`);
        this.router.navigateByUrl('home');
      },
      error: (err) => {
        const msg = err?.error?.message || 'User could not be registered';
        this.alert('Error in registration', '', msg);
      }
    });
    
  }

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
