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
import {IonInfiniteScroll, IonInfiniteScrollContent, IonHeader, IonTitle, IonToolbar, IonContent, IonIcon, IonRefresher, IonRefresherContent, IonText, IonItem, IonProgressBar} from "@ionic/angular/standalone"
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe,TabsPagesPage,IonInfiniteScroll, IonInfiniteScrollContent, IonHeader, IonTitle, IonToolbar, IonContent, IonIcon, IonRefresher, IonRefresherContent,IonText, IonItem, IonProgressBar]
})
export class WalletPage implements OnInit, OnDestroy {
  puntos: number = 6;
  currentUser: User | null = null
  walletBalance = 1;
  walletUser:Wallet [] = [];
  userId: string = '';
  orders: Order[] = [];
  userProgress: number = 0;
  userLevel: number = 0;
  userLevelUp: number = 0;
  userLevelName: string = '';
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
    this.LoadUserLevel();
    this.currentUser = this.userService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.loadUserAndOrders();
    this.LoadUserLevel();
  }

  ngOnDestroy() {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  async getUserBalance() {
    const user_id = await this.userService.getCurrentUserID();

    if (!user_id) {
      console.error("No user ID found. Cannot load orders.");
      return;
    }
    await this.walletService.getWalletBalance(user_id).subscribe({
      next: (res) => {
        this.walletUser = res;
        this.walletBalance = res.balance;
        
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
      console.error('Could not get user ID.');
      this.toast_alert('bottom', 'Could not get user ID.');
    }
  }

  async LoadUserLevel() {

    const user_id = await this.userService.getCurrentUserID();

    this.userService.getUserLevel({user_id}).subscribe({
      next: (res) => {
        if (res.error) {
          this.toast_alert('bottom', res.error);
          console.error(res.error);
          return;
        }

        this.userProgress = res.user_progress/10;
        this.userLevel = res.user_level;
        this.userLevelName = res.user_level_id;

        if (this.userLevel == 0) {
          this.userLevelUp = 3-res.user_progress;
        }
        if (this.userLevel == 1) {
          this.userLevelUp = 6-res.user_progress;
        }
        if (this.userLevel == 2) {
          this.userLevelUp = 10-res.user_progress;
        }

      },
      error: (err) => {
        console.error("Error loading users level:", err);
      }
    })
  }

  
  getGradientClass() {
    if (this.userProgress < 0.3) {
      return 'low-gradient';
    } else if (this.userProgress < 0.6) {
      return 'silver-gradient';
    } else if (this.userProgress < 1) {
      return 'gold-gradient';
    } else {
      return 'diamond-gradient';
    }
  }

  silverColor() {
    if (this.userProgress < 0.3) {
      return "gray-filter";
    }
    else {
      return "";
    }
  }

  goldColor() {
    if (this.userProgress < 0.6) {
      return "gray-filter";
    }
    else {
      return "";
    }
  }

  diamondColor() {
    if (this.userProgress < 1) {
      return "gray-filter";
    }
    else {
      return "";
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
    this.getUserBalance();
    this.LoadUserLevel();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }



}
