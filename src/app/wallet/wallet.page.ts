import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, Platform, IonicModule } from '@ionic/angular';
import { BiometricService } from 'src/services/biometric/biometric.service';
import { Order, Wallet } from 'src/types';
import { Router } from '@angular/router';
import { OrdersService } from 'src/services/orders/orders.service';
import { UserService, type User } from 'src/services/user/user.service';
import { Subscription } from 'rxjs';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';
import { WalletService } from 'src/services/wallet/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,IonicModule,DatePipe,TabsPagesPage]
})
export class WalletPage implements OnInit, OnDestroy {
  puntos: number = 6;
  currentUser: User | null = null
  walletBalance = 1;
  walletUser:Wallet [] = [];
  userId: string = '';
  orders: Order[] = [];
  private ordersSubscription?: Subscription;

  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private biometricService: BiometricService,
    private route: Router,
    private ordersService: OrdersService,
    private userService: UserService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.loadUserAndOrders();
    this.getUserBalance();
    this.currentUser = this.userService.getCurrentUser();
  }

  ionViewWillEnter() {
    console.log("WalletPage will enter, refreshing orders...");
    this.loadUserAndOrders();
  }

  ngOnDestroy() {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  async getUserBalance() {
    console.log("in");
    const user_id = await this.userService.getCurrentUserID();
    console.log("value : " + user_id);

    if (!user_id) {
      console.error("No user ID found. Cannot load orders.");
      return;
    }
    console.log("pasaste");
    this.walletService.getWalletBalance(user_id).subscribe({
      next: (res) => {
        this.walletUser = res;
        this.walletBalance = res.balance;
        console.log(res);
      },
      error: (err) => {
        console.error("Error loading wallet balance:", err);
      }
    })
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
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }

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
            this.walletBalance += amount;
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

  viewDetailOrder(orderId: any) {
    this.route.navigate(['/order-details', orderId]);
  }

  handleRefresh(event: CustomEvent) {
    this.loadOrders();
    this.loadUserAndOrders();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
