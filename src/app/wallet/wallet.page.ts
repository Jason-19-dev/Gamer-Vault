import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonMenuButton, IonRow, IonTitle, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';
import { ToastController } from '@ionic/angular';
import { order, Product } from 'src/types';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    TabsPagesPage,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonTitle,
    IonItem,
  ]
})
export class WalletPage implements OnInit {
  puntos = 6
  saldo = 10.99
  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }
  // ejemplo para historial 
  // transactions: Transaction[] = [
  transactions: any[] = [
    {
      date:'03-marzo-2025',
      amount: 1.40,
      origin: '****8713',
      state:"COMPLATADO",
      type: "Recarga",
      time:'11.17'
    }
  ]
  // toast 
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}
