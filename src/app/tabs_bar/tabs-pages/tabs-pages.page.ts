import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { IonTabBar, IonTabButton, IonIcon } from "@ionic/angular/standalone"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { addIcons } from "ionicons"
import * as icons from "ionicons/icons"
import { CartService } from "src/services/cart/cart.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-tabs-pages",
  templateUrl: "./tabs-pages.page.html",
  styleUrls: ["./tabs-pages.page.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, IonTabBar, IonTabButton, RouterLink, RouterLinkActive],
})
export class TabsPagesPage implements OnInit, OnDestroy {
  cartCount = 0
  private cartSubscription: Subscription | null = null

  constructor(private cartService: CartService) {
    addIcons(icons)
  }

  ngOnInit() {
    // Get initial cart count
    this.updateCartCount()

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.updateCartCount()
    })
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
    }
  }

  private updateCartCount() {
    this.cartCount = this.cartService.getCartCount()
  }
}
