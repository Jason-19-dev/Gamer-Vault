import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, catchError, tap, of, firstValueFrom } from "rxjs"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "src/environments/environment"
import  { UserService } from "../user/user.service"

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
  private isLoadingSubject = new BehaviorSubject<boolean>(false)

  // Observable to allow components to subscribe to cart changes and loading state
  public cartItems$ = this.cartItemsSubject.asObservable()
  public isLoading$ = this.isLoadingSubject.asObservable()

  private apiURL = `${environment.apiURL}/shoppingcart`

  constructor(
    private http: HttpClient,
    private user: UserService,
  ) {
    // Load cart from backend when service initializes
    this.loadCart()
  }

  /**
   * Load cart data from the backend
   * @returns Promise that resolves when cart is loaded
   */
  private async loadCart(): Promise<void> {
    const userId = await this.user.getCurrentUserID();
  
    if (!userId) {
      console.error("No user ID found. Cannot load cart.");
      return;
    }
  
    this.isLoadingSubject.next(true);
  
    try {
      const savedCart = await firstValueFrom(
        this.getCart({ user_id: userId }).pipe(
          catchError((error) => {
            console.error("Error loading cart:", error);
            return of([] as CartItem[]);
          })
        )
      );
  
      this.cartItems = savedCart;
      this.cartItemsSubject.next(this.cartItems);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }
  
  

  /**
   * Refresh cart data from the backend
   * @returns Promise that resolves when cart is refreshed
   */
  refreshCart(): Promise<void> {
    console.log("Refreshing cart data from backend")
    return this.loadCart()
  }

  /**
   * Save cart data to the backend
   * @returns Promise that resolves when cart is saved
   */
  private async saveCart(): Promise<void> {
    const userId = await this.user.getCurrentUserID()

    if (!userId) {
      console.error("No user ID found. Cannot save cart.")
      return Promise.reject(new Error("No user ID found"))
    }

    const payload = {
      user_id: userId,
      products: this.cartItems,
    }

    this.cartItemsSubject.next(this.cartItems)
    this.isLoadingSubject.next(true)

    return firstValueFrom(
      this.updateCart(payload).pipe(
        catchError((error) => {
          console.error("Error updating cart on backend:", error)
          return of(null)
        }),
        tap((res) => {
          console.log("Cart updated on backend:", res)
          this.isLoadingSubject.next(false)
        }),
      ),
    )
  }

  /**
   * Add a product to the cart
   * @param product The product to add
   * @returns boolean indicating if the product was added
   */
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
        name: product.name || product.game_name || "",
        price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
        image_url: product.image_url || "",
        quantity: 1,
      })
      this.saveCart()
      return true
    }
  }

  /**
   * Check if a product is in the cart
   * @param productId The product ID to check
   * @returns boolean indicating if the product is in the cart
   */
  isInCart(productId: string): boolean {
    return this.cartItems.some((item) => item.id === productId)
  }

  /**
   * Remove a product from the cart
   * @param product The product to remove
   * @returns Promise that resolves when the product is removed
   */
  removeCart(product: CartItem): Promise<void> {
    this.cartItems = this.cartItems.filter((item) => item.id !== product.id)
    return this.saveCart()
  }

  /**
   * Clear the cart
   * @returns Promise that resolves when the cart is cleared
   */
  clearCart(): Promise<void> {
    this.cartItems = []
    return this.saveCart()
  }

  /**
   * Get all cart items
   * @returns Array of cart items
   */
  getCartItems(): CartItem[] {
    return this.cartItems
  }

  /**
   * Get the number of items in the cart
   * @returns Number of items in the cart
   */
  getCartCount(): number {
    return this.cartItems.length
  }

  /**
   * Get the total price of all items in the cart
   * @returns Total price
   */
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  /**
   * Get JSON headers for HTTP requests
   */
  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ "Content-Type": "application/json" })
  }

  /**
   * Update cart on the backend
   * @param data Cart data to update
   * @returns Observable of the response
   */
  updateCart(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/update`, data, { headers: this.jsonHeaders })
  }

  /**
   * Get cart from the backend
   * @param data User data to get cart for
   * @returns Observable of the cart data
   */
  getCart(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}`, data, { headers: this.jsonHeaders })
  }
}
