import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, FormGroup } from '@angular/forms';
import { IonCard, IonContent, IonButton, IonRow, IonCol, IonInput, IonIcon, AlertController, IonInputPasswordToggle, IonItem, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Customer } from 'src/types';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  // standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonRow,
    IonCol,
    IonInput,
    IonInputPasswordToggle,


  ]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup
  login = { nameUser: '', password: '' };

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
    }
  ]
  constructor(private router: Router, private alertController: AlertController) {
    addIcons(icons)
  }

  ngOnInit() {
    
  }

  // 
  onLogin(form: NgForm) {

    const { nameUser: name, password: pass } = form.value
    
    const user = this.user.find(user => user.nameUser === name && user.password === pass)
    console.log(form.value)
    console.log(name, pass)

    if (user) {
      this.alert("Welcome!" + " " + name.toUpperCase(), "", "")
      this.router.navigateByUrl('restaurant/home');
    }
    else {
      this.alert('User or password incorrect', "try again", '')
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
