import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonCard, IonContent, IonButton, IonRow, IonCol, IonInput, IonIcon, AlertController, IonInputPasswordToggle, IonItem, IonList, IonText, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { Customer } from 'src/types';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  // standalone: true,
  imports: [IonToolbar, IonHeader, IonText, 
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    IonInput


  ]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup

  constructor(private router: Router, private alertController: AlertController,private fb:FormBuilder, private authService: AuthService) {
    addIcons(icons)
    this.loginForm = this.fb.group({
      userName: ["",[Validators.required,Validators.maxLength(50)]],
      password: ["",[Validators.required,Validators.maxLength(50)]],
    })
  }

  ngOnInit() {
    
  }

  // 
  onLogin() {

    const { userName: name, password: pass } = this.loginForm.value
    
    this.authService.login(name, pass).subscribe({
      next: (response) => {
        console.log(response);
        if (response.token) {
          this.alert("Welcome!" + " " + name.toUpperCase(), "", "")
          this.router.navigateByUrl('home');
        } else {
          this.alert('Incorrect username or password', 'Try again', '');
        }
      },
      error: (err) => {
        console.error(err);
        this.alert('Server error', 'Please try again later', '');
      }
    });
  }

  onSignup() {

    this.router.navigateByUrl('signin');
  }

  // alert 
  async alert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();

    // LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       id: 1,
    //       title: this.title,
    //       body: `Has ahorrado $0.50, sigue así.`,
    //       schedule: { at: new Date(Date.now() + 1000) }, // para ue mande en un seunfo
    //       sound:"default",

    //     }
    //   ]
    // })
  }

  //  login google
  signinGoogle() {

    

  }
}
