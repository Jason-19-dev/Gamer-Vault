import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserService } from "../user/user.service";

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

  private apiURL = `${environment.apiURL}/shoppingcart`;

  constructor(private http: HttpClient, private user: UserService) {
    // Load cart from localStorage when service initializes
    this.loadCart()
    
  }

  private loadCart(): void {
    const user_id = this.user.getCurrentUserID();

    this.getCart({ user_id }).subscribe(savedCart => {
      console.log(savedCart)
      if (savedCart) {
        this.cartItems = (savedCart);
        this.cartItemsSubject.next(this.cartItems);
      }
    });
  }

  private saveCart(): void {
    const user_id = this.user.getCurrentUserID();
  
    if (!user_id) {
      console.error("No user ID found. Cannot save cart.");
      return;
    }
  
    const payload = {
      user_id: user_id,
      products: this.cartItems,
    };
  
    //localStorage.setItem("cart", JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
    this.updateCart(payload).subscribe({
      next: res => console.log("Cart updated on backend:", res),
      error: err => console.error("Error updating cart on backend:", err),
    });
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


  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  updateCart(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/update`, data, { headers: this.jsonHeaders });
  }

  addCart(data: any): Observable<any> {    
    return this.http.post(`${this.apiURL}/add`, data, { headers: this.jsonHeaders });
  }

  getCart(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}`, data, { headers: this.jsonHeaders });
  }

}
