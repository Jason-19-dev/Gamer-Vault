import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonItem, IonThumbnail, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';
import { Order, Order_Details } from 'src/types';
import { OrdersService } from 'src/services/orders/orders.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
  standalone: true,
  imports: [IonItem, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,TabsPagesPage,IonThumbnail]
})
export class OrderDetailsPage implements OnInit {
  orderItems:Order = {} as Order;
  order_id: string = '';
  constructor(private ordersService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getOrderDetails();
  }

  getOrderDetails() {

    this.route.params.subscribe(params => this.order_id = params['id']);

    this.ordersService.getOrderDescription(this.order_id).subscribe({
      next: data=> {

      this.orderItems = data
      console.log(this.orderItems);
    },
    error: err => {
      console.error("Error load order details:", err);
    }
  });
  }
}
