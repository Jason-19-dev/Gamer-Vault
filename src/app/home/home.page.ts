import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonNote,
  IonIcon,
  IonButton,
  AlertController,
  Platform,
} from "@ionic/angular/standalone"
import type { Product } from "src/types"
import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import { chevronForwardCircle, chevronForwardCircleOutline } from "ionicons/icons"
import { ProductsService } from "src/services/products/products.service"

interface CoinItem {
  game: string;
  image_url: string;
}

interface GameItem {
  name: string;
  image_url: string;
  price: string;
}


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
    IonItem,
    IonNote,
    IonHeader,
    TabsPagesPage,
    IonIcon,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  puntos = 6
  saldo = 10.99
  message = ""
  isAndroid = false

  products: Product[] = [] // Inicializa como un arreglo vacío
  public results: Product[] = []

  // Add these properties for categorized products
  coinProducts: CoinItem[] = []
  gameProducts: GameItem[] = []

  //variables del banner
  currentBannerImage: string = '';
  currentBannerText: string = '';
  private bannerIndex: number = 0;
  private bannerInterval: any;


  constructor(
    private alertController: AlertController, // Correctamente inyectado
    private platform: Platform,
    private router: Router,
    private productsService: ProductsService,
    private http: HttpClient,

  ) {
    addIcons({chevronForwardCircle,chevronForwardCircleOutline});
  }

  ngOnInit() {
    this.fetchGameProducts()
    this.fetchCoinProducts()
  }

  ngOnDestroy() {
  if (this.bannerInterval) {
    clearInterval(this.bannerInterval);
  }
}


   private fetchCoinProducts() {
    this.http.get<CoinItem[]>('http://3.231.107.27:5000/products/coins/games-list').subscribe({
      next: (data) => {
        console.log("Monedas recibidas:", data);
        this.coinProducts = data;
      },
      error: (err) => {
        console.error("Error al obtener monedas:", err.message);
      },
    });
  }

     private fetchGameProducts() {
    this.http.get<GameItem[]>('http://3.231.107.27:5000/products/videogames').subscribe({
      next: (data) => {
        console.log("Juegos recibidos:", data);
        this.gameProducts = data;

        this.startBannerRotation();
      },
      error: (err) => {
        console.error("Error al obtener monedas:", err.message);
      },
    });
    }
    private startBannerRotation() {
  if (this.gameProducts.length === 0) return;

  this.currentBannerImage = this.gameProducts[0].image_url;
  this.currentBannerText = this.gameProducts[0].name;

  this.bannerInterval = setInterval(() => {
    this.bannerIndex = (this.bannerIndex + 1) % this.gameProducts.length;
    const current = this.gameProducts[this.bannerIndex];
    this.currentBannerImage = current.image_url;
    this.currentBannerText = current.name;
  }, 5000);
}
  private fetchProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data
        this.results = [...this.products]

        // Filter products by category_name
        //this.coinProducts = this.products.filter((product) => product.category_name === "coin")

        //this.gameProducts = this.products.filter((product) => product.category_name === "videogame")

        console.log("Productos obtenidos:", this.products)
        console.log("Monedas:", this.coinProducts)
        console.log("Juegos:", this.gameProducts)
      },
      error: (err) => {
        console.error("Error al obtener productos:", err.message)
      },
    })
  }

  // Updated handleInput method to filter both categories
  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement
    const query = target.value?.toLowerCase() || ""

    if (query) {
      const filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(query))

      //this.coinProducts = filteredProducts.filter((product) => product.category_name === "coin")

      //this.gameProducts = filteredProducts.filter((product) => product.category_name === "videogame")

      if (filteredProducts.length === 0) {
        this.message = "No Results"
      } else {
        this.message = ""
      }
    } else {
      // Reset to original filtered lists
      //this.coinProducts = this.products.filter((product) => product.category_name === "coin")

      //this.gameProducts = this.products.filter((product) => product.category_name === "videogame")
      this.message = ""
    }
  }

  getBrandFromName(name: string): string {
    if (name.includes("ASUS")) return "ASUS"
    if (name.includes("iPhone")) return "Apple"
    if (name.includes("Sony")) return "Sony"
    if (name.includes("Razer")) return "Razer"
    if (name.includes("Samsung")) return "Samsung"
    if (name.includes("Logitech")) return "Logitech"
    return "Brand"
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

  // Method to get color for game circle based on game name
  getGameColor(name: string): string {
    if (!name) return "#1da1f2" // Default blue

    const nameLower = name.toLowerCase()
    if (nameLower.includes("fortnite")) return "#1da1f2" // Blue
    if (nameLower.includes("roblox")) return "#000000" // Black
    if (nameLower.includes("lol") || nameLower.includes("league")) return "#1e3f20" // Green
    if (nameLower.includes("fifa")) return "#e90052" // Pink
    if (nameLower.includes("valorant")) return "#fa4454" // Red

    // Generate a color based on the name
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const c = (hash & 0x00ffffff).toString(16).toUpperCase()
    return "#" + "00000".substring(0, 6 - c.length) + c
  }

  // Método para navegar al menú
  navigateToMenu() {
    this.router.navigate(["/menu"]) // Cambia '/menu' por la ruta deseada
  }
}

export default HomePage
