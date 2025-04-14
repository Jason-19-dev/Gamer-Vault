import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: CartItem[] = []
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([])

  // Observable to allow components to subscribe to cart changes
  public cartItems$ = this.cartItemsSubject.asObservable()

  constructor() {
    // Load cart from localStorage when service initializes
    this.loadCart()
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart)
      this.cartItemsSubject.next(this.cartItems)
    }
  }

  private saveCart(): void {
    localStorage.setItem("cart", JSON.stringify(this.cartItems))
    this.cartItemsSubject.next(this.cartItems)
  }

  addToCart(product: any): boolean {
    // Check if the product is already in the cart
    const existingItem = this.cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      // Product already exists in cart, return false to indicate it wasn't added
      return false
    } else {
      // Add new item with quantity 1
      this.cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      })
      this.saveCart()
      return true
    }
  }

  isInCart(productId: string): boolean {
    return this.cartItems.some((item) => item.id === productId)
  }

  removeCart(product: CartItem): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== product.id)
    this.saveCart()
  }

  clearCart(): void {
    this.cartItems = []
    this.saveCart()
  }

  getCartItems(): CartItem[] {
    return this.cartItems
  }

  getCartCount(): number {
    return this.cartItems.length
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}
