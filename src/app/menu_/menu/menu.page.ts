import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import {AlertController,IonContent,IonHeader,IonTitle,IonToolbar,IonSearchbar,IonSpinner, IonButtons, IonRefresher, IonRefresherContent } from "@ionic/angular/standalone"
import { ProductsService } from "src/services/products/products.service"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { HttpClient } from "@angular/common/http"
import { environment } from "src/environments/environment"
import { IonBackButton } from "@ionic/angular/standalone"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  available: boolean
  image_url: string
  create_at: string
  game_name?: string // Optional property for game-specific products
}

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
  imports: [IonRefresherContent, IonRefresher, IonButtons,IonContent,IonToolbar,CommonModule,FormsModule,IonHeader,TabsPagesPage,IonTitle,IonSearchbar,IonSpinner,IonBackButton],
})
export class MenuPage implements OnInit {
  title = "Videogames";
  categories = ["Adventure", "Shooters", "Horror", "Action RPG"];
  selectedCategory: string | null = null;
  isLoading = true;
  section: string | null = null;
  // Productos que se mostrarán
  products: any[] = [];
  allProducts: any[] = []; // Almacena todos los productos para el filtrado

  // Consulta de búsqueda
  searchQuery = "";

  constructor(
    private api_product: ProductsService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.section = params["section"];

      if (this.section === "coins") {
        // Mostrar monedas para juegos
        this.title = "In-Game Coins";
        this.categories = ["Fortnite", "Roblox", "League of Legends", "FIFA"];
        this.loadCoinsFromAPI();
      } else {
        // Mostrar videojuegos (por defecto)
        this.title = "Videogames";
        this.categories = ["Adventure", "Shooters", "Horror", "Action RPG"];
        this.loadGamesFromAPI();
      }
    });
  }

  private loadCoinsFromAPI() {
    this.isLoading = true;
    this.http.get<ApiCoinItem[]>(`${environment.apiURL}/products/coins/games-list`).subscribe({
      next: (data) => {
        

        this.products = data.map((item) => ({
          id: item.product_id,
          name: item.game_name || "Game Coin",
          description: `Coins for ${item.game_name}`,
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
        console.error("Error loading coins:", err.message);
        this.products = []; // No mostrar productos si la API falla
        this.isLoading = false;
      },
    });
  }

  private loadGamesFromAPI() {
    this.isLoading = true;
    this.http.get<ApiGameItem[]>(`${environment.apiURL}/products/videogames`).subscribe({
      next: (data) => {

        this.products = data.map((item) => ({
          id: item.product_id,
          name: item.name || "Videogame",
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
        console.error("Error loading games:", err.message);
        this.products = []; // No mostrar productos si la API falla
        this.isLoading = false;
      },
    });
  }

  // Método para formatear la descripción del juego
  private formatGameDescription(game: ApiGameItem): string {
    if (!game.description) return game.name;

    const { developer, genre, release_year } = game.description;
    let description = game.name;

    if (developer) description += ` - ${developer}`;
    if (genre) description += ` | ${genre}`;
    if (release_year) description += ` (${release_year})`;

    return description;
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

 

  // Método para navegar a la página de detalles del producto
  goToProductDetail(product: any) {
    // Determinar el tipo de producto (videojuego o moneda)
    const productType = this.title === "Videogames" ? "videogame" : "coin"

    // Navegar a la página de detalles con el ID del producto y el tipo
    this.router.navigate(["/product-detail", product.id], {
      queryParams: { type: productType },
    })
  }

  // Método para navegar a la página de monedas de un juego específico
  goToGameCoins(gameName: string) {
    this.router.navigate([`/game-coins/${encodeURIComponent(gameName)}`]); // Pasa el nombre del juego como parte de la URL
  }
  
  handleRefresh(event: CustomEvent) {
   this.section === "coins" ? this.loadCoinsFromAPI() : this.loadGamesFromAPI();

    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

}

export default MenuPage
