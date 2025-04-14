import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import {
  AlertController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonChip,
  IonLabel,
  IonButton,
  ToastController,
} from "@ionic/angular/standalone"
import { ProductsService } from "src/services/products/products.service"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { HttpClient } from "@angular/common/http"
import { environment } from "src/environments/environment"
import { CartService } from "src/services/cart/cart.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.page.html",
  styleUrls: ["./product-detail.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonChip,
    IonLabel,
    IonButton,
    TabsPagesPage,
  ],
})
export class ProductDetailPage implements OnInit, OnDestroy {
  productId: string | null = null
  product: any = null
  isLoading = true
  isVideoGame = false
  productTags: string[] = []
  screenshots: string[] = []
  similarProducts: any[] = []
  isInCart = false
  private cartSubscription: Subscription | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private productsService: ProductsService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get("id")
      if (this.productId) {
        this.loadProductDetails(this.productId)
        // Check if product is already in cart
        this.isInCart = this.cartService.isInCart(this.productId)
      } else {
        this.isLoading = false
      }
    })

    // Subscribe to cart changes to update button state
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      if (this.productId) {
        this.isInCart = this.cartService.isInCart(this.productId)
      }
    })
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
    }
  }

  private loadProductDetails(productId: string) {
    this.isLoading = true

    // Determinar si estamos cargando un videojuego o una moneda
    const productType = this.route.snapshot.queryParams["type"] || "videogame"

    if (productType === "coin") {
      this.loadCoinDetails(productId)
    } else {
      this.loadGameDetails(productId)
    }
  }

  // Modificar el método loadGameDetails para usar directamente los datos de la API
  private loadGameDetails(productId: string) {
    // Obtener los detalles del juego desde la API
    const apiUrl = `${environment.apiURL}/products/${productId}`

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        console.log("Detalles del juego recibidos:", data)

        // Usar directamente los datos de la API
        this.isVideoGame = true
        this.product = data

        // Make sure the product has an ID
        if (!this.product.id && this.productId) {
          this.product.id = this.productId
        }

        // Convertir el precio a número para poder usar toFixed()
        this.product.price = Number.parseFloat(this.product.price)

        // Configurar tags basados en los datos del producto
        this.productTags = []
        if (this.product.description?.genre) this.productTags.push(this.product.description.genre)
        if (this.product.description?.platforms) {
          this.product.description.platforms.forEach((platform: string) => {
            this.productTags.push(platform)
          })
        }

        // No cargar screenshots si no vienen en la API
        this.screenshots = []

        // Cargar productos similares
        this.loadSimilarGames()

        // Check if product is in cart
        if (this.product.id) {
          this.isInCart = this.cartService.isInCart(this.product.id)
        }

        this.isLoading = false
      },
      error: (err) => {
        console.error("Error al obtener detalles del juego:", err.message)
        this.alert("Error", "No se pudo cargar la información del producto")
        this.isLoading = false
      },
    })
  }

  // Modificar el método loadCoinDetails para usar directamente los datos de la API
  private loadCoinDetails(productId: string) {
    const apiUrl = `${environment.apiURL}/products/coins/${productId}`

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        console.log("Detalles de la moneda recibidos:", data)

        // Usar directamente los datos de la API
        this.isVideoGame = false
        this.product = data

        // Make sure the product has an ID
        if (!this.product.id && this.productId) {
          this.product.id = this.productId
        }

        // Convertir el precio a número si existe
        if (this.product.price) {
          this.product.price = Number.parseFloat(this.product.price)
        }

        // Configurar tags para monedas
        this.productTags = ["In-Game Currency", "Digital Item"]

        // Cargar productos similares
        this.loadSimilarCoins()

        // Check if product is in cart
        if (this.product.id) {
          this.isInCart = this.cartService.isInCart(this.product.id)
        }

        this.isLoading = false
      },
      error: (err) => {
        console.error("Error al obtener detalles de la moneda:", err.message)
        this.alert("Error", "No se pudo cargar la información del producto")
        this.isLoading = false
      },
    })
  }

  private loadSimilarGames() {
    // En un caso real, harías una petición a la API para obtener juegos similares
    // Por ahora, usamos datos de ejemplo
    this.similarProducts = [
      {
        id: "2",
        name: "The Witcher 3",
        price: 39.99,
        image_url: "/placeholder.svg?height=180&width=140",
      },
      {
        id: "3",
        name: "Grand Theft Auto V",
        price: 29.99,
        image_url: "/placeholder.svg?height=180&width=140",
      },
      {
        id: "4",
        name: "Red Dead Redemption 2",
        price: 49.99,
        image_url: "/placeholder.svg?height=180&width=140",
      },
    ]
  }

  private loadSimilarCoins() {
    // En un caso real, harías una petición a la API para obtener monedas similares
    // Por ahora, usamos datos de ejemplo
    this.similarProducts = [
      {
        id: "7",
        name: "Roblox Robux",
        price: 9.99,
        image_url: "/placeholder.svg?height=180&width=140",
      },
      {
        id: "8",
        name: "Minecraft Minecoins",
        price: 9.99,
        image_url: "/placeholder.svg?height=180&width=140",
      },
    ]
  }

  async addToCart() {
    if (!this.product) return

    // Make sure the product has an ID
    if (!this.product.id && this.productId) {
      this.product.id = this.productId
    }

    // Check if product is already in cart
    if (this.isInCart) {
      const toast = await this.toastController.create({
        message: `${this.product.name} ya está en el carrito`,
        duration: 2000,
        position: "bottom",
        color: "warning",
      })
      toast.present()
      return
    }

    // Add the product to cart using the cart service
    const added = this.cartService.addToCart(this.product)

    if (added) {
      // Show success toast
      const toast = await this.toastController.create({
        message: `${this.product.name} añadido al carrito`,
        duration: 2000,
        position: "bottom",
        color: "success",
      })
      toast.present()

      // Update button state
      this.isInCart = true
    }
  }

  goToProductDetail(productId: string) {
    // Navegar a los detalles de otro producto
    const productType = this.isVideoGame ? "videogame" : "coin"
    this.router.navigate(["/product-detail", productId], {
      queryParams: { type: productType },
    })
  }

  // Añadir método para mostrar alertas
  async alert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    })

    await alert.present()
  }

  // Navigate to cart
  goToCart() {
    this.router.navigate(["/cart"])
  }
}

export default ProductDetailPage
