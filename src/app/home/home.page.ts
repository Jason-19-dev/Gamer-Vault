import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router"
import  { HttpClient } from "@angular/common/http"
import { environment } from "src/environments/environment"

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
import  { Product } from "src/types"
import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import { chevronForwardCircle, chevronForwardCircleOutline } from "ionicons/icons"
import  { ProductsService } from "src/services/products/products.service"

interface CoinItem {
  id: string;
  game_name: string; // Nombre del juego o moneda
  image_url: string;
}

interface GameItem {
  name: string
  image_url: string
  price: string
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
    IonNote,
    IonHeader,
    TabsPagesPage,
    IonIcon,
  ],
})
export class HomePage implements OnInit {
  puntos = 6;
  saldo = 10.99;
  message = "";
  isAndroid = false;

  products: Product[] = []; // Inicializa como un arreglo vacío
  public results: Product[] = [];

  // Add these properties for categorized products
  coinProducts: CoinItem[] = []; // Solo se llenará con datos de la API
  gameProducts: GameItem[] = []; // Solo se llenará con datos de la API

  // Store original data for search filtering
  private allCoinProducts: CoinItem[] = [];
  private allGameProducts: GameItem[] = [];

  // Current search query
  searchQuery = "";

  // Variables del banner
  currentBannerImage = "";
  currentBannerText = "";
  private bannerIndex = 0;
  private bannerInterval: any;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private productsService: ProductsService,
    private http: HttpClient
  ) {
    addIcons({ chevronForwardCircle, chevronForwardCircleOutline });
  }

  ngOnInit() {
    this.fetchGameProducts();
    this.fetchCoinProducts();
  }

  ngOnDestroy() {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }

  private fetchCoinProducts() {
    this.http.get<CoinItem[]>(`${environment.apiURL}/products/coins`).subscribe({
      next: (data) => {
        console.log("Monedas recibidas:", data);
        this.coinProducts = data; // Solo datos de la API
        this.allCoinProducts = [...data]; // Guarda los datos originales para la búsqueda
      },
      error: (err) => {
        console.error("Error al obtener monedas:", err.message);
      },
    });
  }

  private fetchGameProducts() {
    this.http.get<GameItem[]>(`${environment.apiURL}/products/videogames`).subscribe({
      next: (data) => {
        console.log("Juegos recibidos:", data);

        // Seleccionar 10 videojuegos aleatorios
        this.gameProducts = this.getRandomItems(data, 10);
        this.allGameProducts = [...this.gameProducts]; // Guarda los datos originales para la búsqueda

        console.log("Juegos seleccionados aleatoriamente:", this.gameProducts);

        this.startBannerRotation();
      },
      error: (err) => {
        console.error("Error al obtener juegos:", err.message);
      },
    });
  }

  // Método para obtener elementos aleatorios de un arreglo
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random()); // Mezclar el arreglo
    return shuffled.slice(0, count); // Retornar los primeros 'count' elementos
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

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase().trim() || "";
    this.searchQuery = query;

    // Apply filtering
    this.filterProducts();
  }

  filterProducts() {
    if (this.searchQuery) {
      // Filtrar productos de videojuegos por nombre
      this.gameProducts = this.allGameProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery)
      );

      // Filtrar monedas por el campo 'game_name'
      this.coinProducts = this.allCoinProducts.filter((product) =>
        product.game_name.toLowerCase().includes(this.searchQuery)
      );

      // Mostrar mensaje si no se encuentran resultados en ninguna categoría
      if (this.gameProducts.length === 0 && this.coinProducts.length === 0) {
        this.message = "No Results";
      } else {
        this.message = "";
      }
    } else {
      // Restablecer los datos originales cuando se borre la búsqueda
      this.gameProducts = [...this.allGameProducts];
      this.coinProducts = [...this.allCoinProducts];
      this.message = "";
    }

    // Actualizar la rotación del banner si los productos de videojuegos han cambiado
    if (this.gameProducts.length > 0) {
      this.bannerIndex = 0;
      this.currentBannerImage = this.gameProducts[0].image_url;
      this.currentBannerText = this.gameProducts[0].name;
    } else {
      this.currentBannerImage = "";
      this.currentBannerText = "No games found";
    }
  }

  getBrandFromName(name: string): string {
    if (!name) return "Brand"

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

  // Método para navegar al menú con parámetro para indicar qué sección mostrar
  navigateToMenu(section = "videogames") {
    this.router.navigate(["/menu"], {
      queryParams: {
        section: section,
      },
    })
  }
}

export default HomePage
