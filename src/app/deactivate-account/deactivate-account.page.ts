import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.page.html',
  styleUrls: ['./deactivate-account.page.scss'],
  standalone: true,                                    
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonButtons, 
    IonBackButton, 
    IonInput, 
    IonButton,
    ReactiveFormsModule

  ]
})
export class DeactivateAccountPage implements OnInit {

  confirmForm: FormGroup; // variable corregida

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private user: UserService 
  ) {
    this.confirmForm = this.fb.group({
      confirm: ['', [Validators.required, Validators.pattern(/^(delete me)$/i)]]
    })
  }

  ngOnInit() {
  }

  async deleteAccount() {

    const user_id = await this.user.getCurrentUserID();


    this.authService.deactivateUser({user_id}).subscribe(
      (res) => {
        console.log(res)
        if (res.message) {
          alert('Account deleted successfully. ');
          this.router.navigateByUrl('/login');
        }
        else {
          alert(res.error);
        }
      },
      (err) => {
        console.error(err)
      }
      
    )

}


}

