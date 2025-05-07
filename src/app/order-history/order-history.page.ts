import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonItem, IonButton, IonBackButton, IonButtons, IonRefresherContent, IonRefresher } from '@ionic/angular/standalone';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';
import { OrdersService } from 'src/services/orders/orders.service';
import { UserService } from 'src/services/user/user.service';
import { Order } from 'src/types';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
  standalone: true,
  imports: [IonRefresher, IonRefresherContent, IonButtons, IonBackButton, IonButton, IonItem, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TabsPagesPage]
})
export class OrderHistoryPage implements OnInit {
  orders: Order [] = [];
  constructor( private ordersService: OrdersService,private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.getUserOrder();
  
  }

  async getUserOrder(){
    const user_id = await this.userService.getCurrentUserID();
    if (!user_id) {
      console.error("No user ID found. Cannot load orders.");
      return;
    }
    this.ordersService.load_user_orders(user_id).subscribe({
      next: (res) => {
        this.orders = res;
    },
    error: (err) => {
      console.error("Error loading orders:", err);
    }
  })
  }

  viewDetailOrder(orderDescription: any) {
    console.log(orderDescription);
    this.router.navigate(['/order-details', orderDescription]);

  }
  handleRefresh(event: CustomEvent) {
    this.getUserOrder();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  

}
