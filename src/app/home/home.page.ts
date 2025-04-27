import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router" // Changed from type-only import
import  { HttpClient } from "@angular/common/http" // Changed from type-only import
import { environment } from "src/environments/environment"

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonNote,
  IonIcon,
   AlertController, // Changed from type-only import
   Platform, // Changed from type-only import
} from "@ionic/angular/standalone"
// Keep this as a type-only import since it's just for type checking
import type { GameItem, CoinItem } from "src/types"
import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import { chevronForwardCircle, chevronForwardCircleOutline } from "ionicons/icons"
import  { ProductsService } from "src/services/products/products.service" // Changed from type-only import

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonNote,
    IonHeader,
    TabsPagesPage,
    IonIcon,
  ],
})
export class HomePage implements OnInit {
  puntos = 6
  saldo = 10.99
  message = ""
  isAndroid = false

  // Add these properties for categorized products
  coinProducts: CoinItem[] = [] // Solo se llenará con datos de la API
  gameProducts: GameItem[] = [] // Solo se llenará con datos de la API

  // Store original data for search filtering
  private allCoinProducts: CoinItem[] = []
  private allGameProducts: GameItem[] = []

  // Current search query
  searchQuery = ""

  // Variables del banner
  currentBannerImage = ""
  currentBannerText = ""
  bannerIndex = 0
  private bannerInterval: any

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private productsService: ProductsService,
    private http: HttpClient,
  ) {
    addIcons({ chevronForwardCircle, chevronForwardCircleOutline })
  }

  ngOnInit() {
    this.fetchGameProducts()
    this.fetchCoinProducts()
  }

  ngOnDestroy() {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval)
    }
  }

  private fetchCoinProducts() {
    this.productsService.getCoins().subscribe({
      next: (data) => {
        console.log("Monedas recibidas:", data)

        // Ensure each coin has an id property
        this.coinProducts = data.map((coin) => {
          // If the coin doesn't have an id, use product_id or generate one
          if (!coin.id) {
            return {
              ...coin,
              id: coin.product_id || `coin_${coin.game_name}_${Date.now()}`,
            }
          }
          return coin
        })

        this.allCoinProducts = [...this.coinProducts] // Guarda los datos originales para la búsqueda
      },
      error: (err) => {
        console.error("Error al obtener monedas:", err.message)
      },
    })
  }

  private fetchGameProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        console.log("Juegos recibidos:", data)

        // Ensure each game has an id property
        const gamesWithIds = data.map((game) => {
          // If the game doesn't have an id, use product_id or generate one
          if (!game.id) {
            return {
              ...game,
              id: game.product_id || `game_${game.name}_${Date.now()}`,
            }
          }
          return game
        })

        // Seleccionar 10 videojuegos aleatorios
        this.gameProducts = this.getRandomItems(gamesWithIds, 10)
        this.allGameProducts = [...this.gameProducts] // Guarda los datos originales para la búsqueda

        console.log("Juegos seleccionados aleatoriamente:", this.gameProducts)

        this.startBannerRotation()
      },
      error: (err) => {
        console.error("Error al obtener juegos:", err.message)
      },
    })
  }

  // Método para obtener elementos aleatorios de un arreglo
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random()) // Mezclar el arreglo
    return shuffled.slice(0, count) // Retornar los primeros 'count' elementos
  }

  private startBannerRotation() {
    if (this.gameProducts.length === 0) return

    this.currentBannerImage = this.gameProducts[0].image_url
    this.currentBannerText = this.gameProducts[0].name

    this.bannerInterval = setInterval(() => {
      this.bannerIndex = (this.bannerIndex + 1) % this.gameProducts.length
      const current = this.gameProducts[this.bannerIndex]
      this.currentBannerImage = current.image_url
      this.currentBannerText = current.name
    }, 5000)
  }

  handleInput(event: Event) {
    const target: HTMLIonSearchbarElement = event.target as HTMLIonSearchbarElement
    const query = target.value?.toLowerCase().trim() || ""
    this.searchQuery = query

    // Apply filtering
    this.filterProducts()
  }

  filterProducts() {
    if (this.searchQuery) {
      // Filtrar productos de videojuegos por nombre
      this.gameProducts = this.allGameProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery),
      )

      // Filtrar monedas por el campo 'game_name'
      this.coinProducts = this.allCoinProducts.filter((product) =>
        product.game_name.toLowerCase().includes(this.searchQuery),
      )

      // Mostrar mensaje si no se encuentran resultados en ninguna categoría
      if (this.gameProducts.length === 0 && this.coinProducts.length === 0) {
        this.message = "No Results"
      } else {
        this.message = ""
      }
    } else {
      // Restablecer los datos originales cuando se borre la búsqueda
      this.gameProducts = [...this.allGameProducts]
      this.coinProducts = [...this.allCoinProducts]
      this.message = ""
    }

    // Actualizar la rotación del banner si los productos de videojuegos han cambiado
    if (this.gameProducts.length > 0) {
      this.bannerIndex = 0
      this.currentBannerImage = this.gameProducts[0].image_url
      this.currentBannerText = this.gameProducts[0].name
    } else {
      this.currentBannerImage = ""
      this.currentBannerText = "No games found"
    }
  }



  // Method to get the first letter of the game name for the circle
  getGameInitial(name: string): string {
    if (!name) return "G"

    // Check for specific games
    if (name.toLowerCase().includes("fortnite")) return "F"
    if (name.toLowerCase().includes("roblox")) return "□"
    if (name.toLowerCase().includes("lol") || name.toLowerCase().includes("league")) return "L"
    if (name.toLowerCase().includes("fifa")) return "F"
    if (name.toLowerCase().includes("valorant")) return "V"

    // Default to first letter
    return name.charAt(0).toUpperCase()
  }


  // Método para navegar al menú con parámetro para indicar qué sección mostrar
  navigateToMenu(section = "videogames") {
    this.router.navigate(["/menu"], {
      queryParams: {
        section: section,
      },
    })
  }

  // Method to navigate to product detail or game-coins page
  navigateToProductDetail(product: any, type: "videogame" | "coin", event: Event) {
    // Stop event propagation to prevent the section click from triggering
    event.stopPropagation()

    if (!product) {
      console.error("Cannot navigate: Product is missing", product)
      return
    }

    // For coins, navigate to the game-coins page with the game name
    if (type === "coin") {
      if (!product.game_name) {
        console.error("Cannot navigate: Coin game_name is missing", product)
        return
      }

      console.log(`Navigating to game-coins for ${product.game_name}:`, product)

      // Navigate to game-coins page with the game name
      this.router.navigate(["/game-coins", encodeURIComponent(product.game_name)])
      return
    }

    // For videogames, continue with the existing logic
    // Check for different possible ID field names
    const productId = product.id || product.product_id || product.id_product

    if (!productId) {
      console.log("Product object:", product)
      console.error("Cannot navigate: Product ID is missing. Available fields:", Object.keys(product))
      return
    }

    console.log(`Navigating to ${type} detail:`, product)

    // Navigate to product detail page with the product ID and type
    this.router.navigate(["/product-detail", productId], {
      queryParams: {
        type: type,
      },
    })
  }
}

export default HomePage
