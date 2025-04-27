import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { BiometricService } from 'src/services/biometric/biometric.service';
import { Order, GameItem } from 'src/types';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { OrdersService } from 'src/services/orders/orders.service';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/services/user/user.service';
import { Subscription } from 'rxjs';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatePipe,
    TabsPagesPage
  ]
})
export class WalletPage implements OnInit, OnDestroy {
  puntos: number = 6;
  saldo: number = 10.99;
  userId: string = '';
  orders: Order[] = [];
  private ordersSubscription?: Subscription;
  private logoutSubscription?: Subscription;

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
    private ordersService: OrdersService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadUserAndOrders();
  }

  ngOnDestroy() {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }


  async loadUserAndOrders() {
    this.userId = await this.userService.getCurrentUserID() || '';
    if (this.userId) {
      this.loadOrders();
    } else {
      console.error('No se pudo obtener el ID del usuario.');
      this.toast_alert('bottom', 'Error al obtener la información del usuario.');
    }
  }

  loadOrders() {
    if (this.userId) {
      this.ordersSubscription = this.ordersService.load_user_orders(this.userId).subscribe({
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
      this.orders = [];
      console.error('Usuario no autenticado');
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
    return 'Order';
  }

  viewDetailOrder(order: Order) {
    console.log(order);
  }
}

