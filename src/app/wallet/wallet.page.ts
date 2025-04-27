import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';
import { ToastController } from '@ionic/angular';
import { BiometricService } from 'src/services/biometric/biometric.service';
import { Order, GameItem} from 'src/types';
import { IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonMenuButton, IonRow, IonTitle, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { OrdersService } from 'src/services/orders/orders.service';
import { jwtDecode } from 'jwt-decode';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

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
    IonHeader,
    IonTitle,
    IonItem,
    DatePipe,
    IonicModule 
  ]
})
export class WalletPage implements OnInit {

  puntos: number = 6;
  saldo: number = 10.99;
  userId: string = '';
  orders: any[] = [];

  transactions: any[] = [
    {
      date: '03-marzo-2025',
      amount: 1.40,
      origin: '****8713',
      state: "COMPLETADO",
      type: "Recarga",
      time: '11:17'
    }
  ];

  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private biometricService: BiometricService,
    private route: Router,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.loadUserIdFromToken();
    this.loadOrders();
  }

  loadUserIdFromToken() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken: any = jwtDecode(authToken);
        this.userId = decodedToken.user_id;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.error('Token no encontrado');
    }
  }

  loadOrders() {
    if (this.userId) {
      this.ordersService.load_user_orders(this.userId).subscribe({
        next: (res) => {
          this.orders = res || [];
          console.log("Orders loaded:", this.orders);
        },
        error: (err) => {
          this.toast_alert('bottom', 'Error al cargar órdenes');
          console.error(err);
        }
      });
    } else {
      this.toast_alert('bottom', 'Usuario no autenticado');
    }
  }

  async makeRecharge(amount: number) {
    try {
      const result = await this.biometricService.verifyIdentity("Confirmar recarga");
      if (result) {
        const data = {
          userId: this.userId,
          amount: amount,
          type: 'Recarga',
          origin: '****8713',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        };

        this.ordersService.create_new_order(data).subscribe({
          next: () => {
            this.saldo += amount;
            this.toast_alert('top', 'Recarga exitosa');
            this.loadOrders();
          },
          error: (err) => {
            this.toast_alert('bottom', 'Error al realizar recarga');
            console.error(err);
          }
        });
      }
    } catch (error) {
      this.toast_alert('bottom', 'Autenticación fallida');
      console.error('Authentication failed', error);
    }
  }

  async toast_alert(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
    });
    await toast.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authenticate();
    });
  }

  async authenticate() {
    try {
      const result = await this.biometricService.verifyIdentity("Autenticación requerida");
      if (result) {
        this.route.navigate(['user']);
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
  }

  getOrderIconText(): string {
    return 'Order'; //  Return a generic icon character
  }
}