import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCheckbox, IonContent, IonInput, IonInputPasswordToggle, IonText, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular/standalone';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
        username: ['', [Validators.required, Validators.maxLength(25)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
        password_hash: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        password_confirm: ['', [Validators.required]],
        dateOfBirth:['', [Validators.required, minAgeValidator(18)]]

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
    delete formData.password_confirm;

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log("hola");
        this.alert('Successful registration', '', `Welcome ${formData.username.toUpperCase()}!`);
        this.router.navigateByUrl('home');
      },
      error: (err) => {
        const msg = 'User could not be registered';
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

function minAgeValidator (minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const isUnderage = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    const finalAge = isUnderage ? age - 1 : age;

    if (isNaN(finalAge) || finalAge < minAge) {
      return { underage: true };
    }

    return null;
  };
}
