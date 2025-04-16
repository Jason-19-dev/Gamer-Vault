import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  AlertController,
  ToastController,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol, IonButtons, IonBackButton } from "@ionic/angular/standalone"
import { CartService, type CartItem } from "src/services/cart/cart.service"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import { cartOutline, trashOutline, closeCircleOutline } from "ionicons/icons"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
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
    IonThumbnail,
    IonIcon,
    IonHeader,
    TabsPagesPage,
  ],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = []
  subtotal = 0
  roundedTotal = 0
  savings = 0
  finalTotal = 0
  toastMessage: string | null = null; // Propiedad para el mensaje del toast
  private cartSubscription: Subscription | null = null

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({ trashOutline, closeCircleOutline, cartOutline });
  }

  ngOnInit() {
    this.loadCartItems()

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.loadCartItems()
    })
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
    }
  }

  private loadCartItems() {
    this.cartItems = this.cartService.getCartItems()
    this.calculateTotals()
    console.log("Cart items loaded:", this.cartItems)
  }

  private calculateTotals() {
    // Calculate subtotal
    this.subtotal = this.cartService.getTotal()

    // Round up to the nearest dollar
    this.roundedTotal = Math.ceil(this.subtotal)

    // Calculate savings (difference between subtotal and rounded total)
    this.savings = this.roundedTotal - this.subtotal

    // Final total is the rounded total
    this.finalTotal = this.roundedTotal

    // If cart is empty, reset all values
    if (this.cartItems.length === 0) {
      this.subtotal = 0
      this.roundedTotal = 0
      this.savings = 0
      this.finalTotal = 0
    }
  }

  removeFromCart(product: CartItem) {
    this.cartService.removeCart(product)
    this.showToast(`${product.name} removed from cart`)
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: "Confirm",
      message: "Are you sure you want to clear the cart?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Clear",
          handler: () => {
            this.cartService.clearCart()
            this.showToast("Cart cleared")
          },
        },
      ],
    })

    await alert.present()
  }

  checkout() {
    // Here you would implement the checkout process
    this.showToast("Processing payment...")
    // Navigate to a thank you page or payment processing page
    // this.router.navigate(['/checkout']);
  }

  showToast(message: string) {
    this.toastMessage = message; // Actualiza el mensaje del toast
    setTimeout(() => {
      this.toastMessage = null; // Limpia el mensaje después de 3 segundos
    }, 3000);
  }

  continueShopping() {
    this.router.navigate(["/home"])
  }
}

export default CartPage
