import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn , AbstractControl } from "@angular/forms";
import { IonContent, IonHeader, IonCard, IonInput, IonButton, IonText, IonToolbar, IonButtons, IonBackButton, IonTitle} from '@ionic/angular/standalone';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonButton,
    IonInput,
    IonText,
    IonHeader,
    IonToolbar,
    IonButtons, 
    IonBackButton,
    IonTitle
  ],
})

export class ChangePasswordPage implements OnInit {

  changePasswordForm: FormGroup; // variable corregida

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private user: UserService 
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', [Validators.required, Validators.maxLength(50)]],
      new_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      password_confirm: ['', [Validators.required]],
    }, { validators: [
          passwordValidator('new_password', 'password_confirm'),  
          newPasswordValidator('current_password', 'new_password')
        ]}
  );
  }

  async saveChanges(){

    if (this.changePasswordForm.invalid) {
      return
    }

    const user_id = await this.user.getCurrentUserID()
    const {
      current_password,
      new_password,
      password_confirm
    } = this.changePasswordForm.value;

    const data = {
      user_id,
      current_password,
      new_password,
      password_confirm
    }

    
    this.authService.changePassword(data).subscribe({
      next: (res) => {
        console.log(res);
    
        if (res.message) {
          alert('Password changed successfully. Please log in with your new password.');
          this.router.navigateByUrl('/login');
        }
        else {
          alert(res.error);
        }
      },
      error: (err) => {
        console.log("error", err.error);
        alert('${err}');

        
      }
    });
    


  }

showPassword = false;
toggleVisible = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

checkBlur(event: any) {
  const value = event.target.value;
  if (!value) {
    this.toggleVisible = false;
  }
}

  ngOnInit() {
  }

}


function passwordValidator(newPassword: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const group = formGroup as FormGroup;
    const newPass = group.get(newPassword)?.value;
    const confirmPass = group.get(confirmPassword)?.value;

    if (confirmPass !== newPass) {
      group.get(confirmPassword)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  };
}

function newPasswordValidator(currentPassword: string, newPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const group = formGroup as FormGroup;
    const currentPass = group.get(currentPassword)?.value;
    const newPass = group.get(newPassword)?.value;


    if (newPass === currentPass) {
      group.get(newPassword)?.setErrors({ passwordMatch: true });
      return { passwordMatch: true };
    }

    return null;
  };
}


