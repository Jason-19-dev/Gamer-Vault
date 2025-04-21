import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IonButton, IonCard, IonCheckbox, IonContent, IonInput, IonInputPasswordToggle, IonText, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { AuthService } from 'src/services/auth/auth.service';
import { CartService } from 'src/services/cart/cart.service';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular/standalone';
import { TermsConditionsComponent } from 'src/app/modals/terms-conditions/terms-conditions.component';
import { IonicModule,ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule
    /*
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonCheckbox,
    IonText,
    ReactiveFormsModule,
    IonDatetime,
    IonInput,
    IonicModule
    */
  ]
})
export class SigninPage implements OnInit {

  form_signin: FormGroup;;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private alertController: AlertController, 
    private authService: AuthService, 
    private modalController: ModalController, 
    private cartService: CartService) 
    {
    this.form_signin = this.fb.group(
      {
        username: ['', [Validators.required, Validators.maxLength(25)]],
        birth_date:['', [Validators.required, minAgeValidator(18)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
        password_hash: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        password_confirm: ['', [Validators.required]],
        termsAccepted: [false, [Validators.requiredTrue]]
      }, { validators: passwordValidator('password_hash', 'password_confirm') }
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
    delete formData.termsAccepted;

    this.authService.register(formData).subscribe({
      next: (res) => {
        const user_id = res.user_id;
        this.cartService.addCart({ user_id }).subscribe();
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
async openTermsModal(event?: Event) {
  if (event) event.preventDefault(); // Evita que se marque automáticamente

  const modal = await this.modalController.create({
    component: TermsConditionsComponent,
    backdropDismiss: false,
    cssClass: 'terms-modal-popup'
  });

  await modal.present();

  const { data, role } = await modal.onDidDismiss();

  if (role === 'accepted') {
    this.form_signin.get('termsAccepted')?.setValue(true);
  } else if (role === 'cancel') {
    this.form_signin.get('termsAccepted')?.setValue(false);
  }
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

    if (finalAge < minAge) {
      return { underage: true };
    }

    return null;
  };
}


function passwordValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const group = formGroup as FormGroup;
    const password = group.get(passwordKey)?.value;
    const confirmPassword = group.get(confirmPasswordKey)?.value;

    if (password !== confirmPassword) {
      group.get(confirmPasswordKey)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  };
}
