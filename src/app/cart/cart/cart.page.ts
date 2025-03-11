import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonThumbnail, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CartService } from 'src/services/cart.service';
import { TabsPagesPage } from 'src/app/tabs_bar/tabs-pages/tabs-pages.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonList,
    IonButton,
    IonLabel,
    IonThumbnail,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    TabsPagesPage

  ]
})
export class CartPage implements OnInit {


  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  removeFromCart(product: any) {
    this.cartService.removeCart(product);
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}
