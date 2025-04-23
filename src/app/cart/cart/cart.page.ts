import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router"
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
  IonSpinner,
} from "@ionic/angular/standalone"
import  { CartService, CartItem } from "src/services/cart/cart.service"
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
    IonSpinner,
    TabsPagesPage,
  ],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = []
  subtotal = 0
  roundedTotal = 0
  savings = 0
  finalTotal = 0
  toastMessage: string | null = null
  isLoading = false
  private cartSubscription: Subscription | null = null

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({trashOutline,closeCircleOutline,cartOutline});
  }

  ngOnInit() {
    // Subscribe to cart changes for real-time updates
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.loadCartItems()
    })
  }

  // Ionic lifecycle hook - called every time the page is about to enter
  ionViewWillEnter() {
    console.log("Cart page entering view - refreshing cart data")
    this.isLoading = true
    // Force a refresh of the cart data from the backend
    this.cartService
      .refreshCart()
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.error("Error refreshing cart:", error)
        this.isLoading = false
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
    this.isLoading = true
    this.cartService
      .removeCart(product)
      .then(() => {
        this.showToast(`${product.name} removed from cart`)
        this.isLoading = false
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error)
        this.showToast("Failed to remove item from cart")
        this.isLoading = false
      })
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
            this.isLoading = true
            this.cartService
              .clearCart()
              .then(() => {
                this.showToast("Cart cleared")
                this.isLoading = false
              })
              .catch((error) => {
                console.error("Error clearing cart:", error)
                this.showToast("Failed to clear cart")
                this.isLoading = false
              })
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
    this.router.navigate(["/checkout"])
  }

  showToast(message: string) {
    this.toastMessage = message // Actualiza el mensaje del toast
    setTimeout(() => {
      this.toastMessage = null // Limpia el mensaje después de 3 segundos
    }, 3000)
  }

  continueShopping() {
    this.router.navigate(["/home"])
  }
}

export default CartPage
