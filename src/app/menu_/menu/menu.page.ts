import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import {
  AlertController,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonSpinner,
} from "@ionic/angular/standalone"
import type { Product } from "src/types"
import { ProductsService } from "src/services/products/products.service"
import { LocalNotifications } from "@capacitor/local-notifications"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { HttpClient } from "@angular/common/http"
import { environment } from "src/environments/environment";

// Interfaces para los datos de la API según la estructura real
interface ApiCoinItem {
  category_name: string
  game_name: string
  image_url: string
  product_id: string
}

interface ApiGameItem {
  category_name: string
  created_at: string
  description: {
    developer: string
    genre: string
    platforms: string[]
    release_year: number
  }
  id_category: string
  image_url: string
  name: string
  price: string
  product_id: string
}

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonHeader,
    TabsPagesPage,
    IonTitle,
    IonSearchbar,
    IonSpinner,
  ],
})
export class MenuPage implements OnInit {
  title = "Videogames";
  categories = ["Adventure", "Shooters", "Horror", "Action RPG"];
  selectedCategory: string | null = null;
  isLoading = true;

  // Productos que se mostrarán
  products: any[] = [];
  allProducts: any[] = []; // Almacena todos los productos para el filtrado

  // Consulta de búsqueda
  searchQuery: string = "";

  // Productos de respaldo en caso de error
  fallbackGames: Product[] = [
    {
      id: 1,
      name: "Spiderman 2",
      description: "Spiderman 2",
      price: 80.0,
      stock: 10,
      available: true,
      image_url:
        "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-color-lineup-230912_big.jpg.large.jpg",
      create_at: "2024-02-27T10:00:00Z",
    },
    {
      id: 2,
      name: "God of War Ragnarok",
      description: "God of War Ragnarok",
      price: 80.0,
      stock: 5,
      available: true,
      image_url:
        "https://www.sony.com.pa/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=165&bgcolor=FFFFFF&bgc=FFFFFF",
      create_at: "2024-02-26T15:30:00Z",
    },
  ]

  fallbackCoins: Product[] = [
    {
      id: 6,
      name: "Fortnite V-Bucks",
      description: "1000 V-Bucks para Fortnite",
      price: 9.99,
      stock: 999,
      available: true,
      image_url:
        "https://cdn2.unrealengine.com/Fortnite/fortnite-game/v-bucks/V-Bucks_1000x1000-1000x1000-2f68d41a76e15d2fd2eafb62a186c410c167285d.png",
      create_at: "2024-02-27T10:00:00Z",
    },
    {
      id: 7,
      name: "Roblox Robux",
      description: "800 Robux para Roblox",
      price: 9.99,
      stock: 999,
      available: true,
      image_url: "https://images.rbxcdn.com/e452125426ae1abb1d19a4c06af31f29.svg",
      create_at: "2024-02-27T10:00:00Z",
    },
  ]

  constructor(
    private api_product: ProductsService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router, // Añadir Router al constructor
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      const section = params["section"]

      if (section === "coins") {
        // Mostrar monedas para juegos
        this.title = "In-Game Coins"
        this.categories = ["Fortnite", "Roblox", "League of Legends", "FIFA"]
        this.loadCoinsFromAPI()
      } else {
        // Mostrar videojuegos (por defecto)
        this.title = "Videogames"
        this.categories = ["Adventure", "Shooters", "Horror", "Action RPG"]
        this.loadGamesFromAPI()
      }
    })
  }

  private loadCoinsFromAPI() {
    this.isLoading = true;
    this.http
      .get<ApiCoinItem[]>(`${environment.apiURL}/products/coins`)
      .subscribe({
        next: (data) => {
          console.log("Monedas recibidas:", data);

          this.products = data.map((item) => ({
            id: item.product_id,
            name: item.game_name || "Moneda de juego",
            description: `Monedas para ${item.game_name}`,
            price: 9.99,
            stock: 999,
            available: true,
            image_url: item.image_url || "assets/images/default-image.png",
            create_at: new Date().toISOString(),
            category_name: item.category_name,
            game_name: item.game_name,
          }));

          this.allProducts = [...this.products]; // Guarda todos los productos para el filtrado
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error al obtener monedas:", err.message);
          this.alert();
          this.messageNotification();
          this.products = this.fallbackCoins;
          this.allProducts = [...this.products]; // Guarda los productos de respaldo
          this.isLoading = false;
        },
      });
  }

  private loadGamesFromAPI() {
    this.isLoading = true;
    this.http
      .get<ApiGameItem[]>(`${environment.apiURL}/products/videogames`)
      .subscribe({
        next: (data) => {
          console.log("Juegos recibidos:", data);

          this.products = data.map((item) => ({
            id: item.product_id,
            name: item.name || "Videojuego",
            description: this.formatGameDescription(item),
            price: Number.parseFloat(item.price) || 0.0,
            stock: 10,
            available: true,
            image_url: item.image_url || "assets/images/default-image.png",
            create_at: item.created_at || new Date().toISOString(),
            category_name: item.category_name,
            developer: item.description?.developer,
            genre: item.description?.genre,
            platforms: item.description?.platforms,
            release_year: item.description?.release_year,
          }));

          this.allProducts = [...this.products]; // Guarda todos los productos para el filtrado
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error al obtener juegos:", err.message);
          this.alert();
          this.messageNotification();
          this.products = this.fallbackGames;
          this.allProducts = [...this.products]; // Guarda los productos de respaldo
          this.isLoading = false;
        },
      });
  }

  // Método para formatear la descripción del juego
  private formatGameDescription(game: ApiGameItem): string {
    if (!game.description) return game.name

    const { developer, genre, release_year } = game.description
    let description = game.name

    if (developer) description += ` - ${developer}`
    if (genre) description += ` | ${genre}`
    if (release_year) description += ` (${release_year})`

    return description
  }

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null
    } else {
      this.selectedCategory = category
    }

    // Filtrar productos por categoría
    if (this.title === "Videogames" && this.selectedCategory) {
      // Para videojuegos, filtrar por género
      this.filterGamesByGenre(this.selectedCategory)
    } else if (this.title === "In-Game Coins" && this.selectedCategory) {
      // Para monedas, filtrar por nombre del juego
      this.filterCoinsByGame(this.selectedCategory)
    }
  }

  // Filtrar videojuegos por género
  private filterGamesByGenre(genre: string) {
    // Implementar lógica de filtrado por género
    // Por ahora, solo mostramos un mensaje en consola
    console.log(`Filtrando juegos por género: ${genre}`)
  }

  // Filtrar monedas por juego
  private filterCoinsByGame(game: string) {
    // Implementar lógica de filtrado por juego
    // Por ahora, solo mostramos un mensaje en consola
    console.log(`Filtrando monedas por juego: ${game}`)
  }

  // Método para filtrar productos
  filterProducts() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      this.products = this.allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    } else {
      this.products = [...this.allProducts]; // Restablece los productos si no hay búsqueda
    }
  }

  async alert() {
    const alert = await this.alertController.create({
      header: "API FAIL",
      subHeader: "",
      message: "Error al obtener los productos",
      buttons: ["OK"],
    })

    await alert.present()
  }

  messageNotification() {
    LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: this.title,
          body: `Has ahorrado $0.50, sigue así.`,
          schedule: { at: new Date(Date.now() + 1000) }, // para que mande en un segundo
          sound: "default",
        },
      ],
    })
  }

  // Método para navegar a la página de detalles del producto
  goToProductDetail(product: any) {
    // Determinar el tipo de producto (videojuego o moneda)
    const productType = this.title === "Videogames" ? "videogame" : "coin"

    // Navegar a la página de detalles con el ID del producto y el tipo
    this.router.navigate(["/product-detail", product.id], {
      queryParams: { type: productType },
    })
  }
}

export default MenuPage
