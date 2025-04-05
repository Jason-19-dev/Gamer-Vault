import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonCard, IonContent, IonButton, IonRow, IonCol, IonInput, IonIcon, AlertController, IonInputPasswordToggle, IonItem, IonList, IonText, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
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

  user: Customer[] = [
    {
      id: 1,
      nameUser: 'jason',
      email: 'jason@example.com',
      phone: '12345679',
      birthday_date: '19-02-2002',
      address: '',
      contry: 'Panama',
      password: 'admin',
      is_active: true,
      role: 'admin',
      create_at: ''
    },
    {
      id: 2,
      nameUser: 'adriana',
      email: 'adriana@example.com',
      phone: '12345679',
      birthday_date: '19-02-2002',
      address: '',
      contry: 'Panama',
      password: 'admin',
      is_active: true,
      role: 'admin',
      create_at: ''
    },
    {
      id: 3,
      nameUser: 'jack',
      email: 'jack@example.com',
      phone: '12345679',
      birthday_date: '19-02-2002',
      address: '',
      contry: 'Panama',
      password: 'admin',
      is_active: true,
      role: 'admin',
      create_at: ''
    },
    {
      id: 4,
      nameUser: 'jeremy',
      email: 'jeremy@example.com',
      phone: '12345679',
      birthday_date: '19-02-2002',
      address: '',
      contry: 'Panama',
      password: 'admin',
      is_active: true,
      role: 'admin',
      create_at: ''
    },
    {
      id: 5,
      nameUser: 'carlos',
      email: 'carlos@example.com',
      phone: '12345679',
      birthday_date: '19-02-2002',
      address: '',
      contry: 'Panama',
      password: 'admin',
      is_active: true,
      role: 'admin',
      create_at: ''
    }
  ]
  constructor(private router: Router, private alertController: AlertController,private fb:FormBuilder) {
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
    
    const user = this.user.find(user => user.nameUser === name && user.password === pass)
    console.log(this.loginForm.value)

    if (user) {
      this.alert("Welcome!" + " " + name.toUpperCase(), "", "")
      this.router.navigateByUrl('home');
    }
    else {
      this.alert('Usuario o contraseña incorrectos', "inténtalo de nuevo", '')
    }
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
