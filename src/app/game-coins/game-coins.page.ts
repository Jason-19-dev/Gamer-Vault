import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonButton,
  ToastController,
} from "@ionic/angular/standalone"
import { HttpClient } from "@angular/common/http"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { CartService } from "src/services/cart/cart.service"
import { addIcons } from "ionicons"
import { cartOutline, arrowBackOutline, homeOutline } from "ionicons/icons"

interface CoinOption {
  category_name: string
  created_at: string
  description: {
    currency: string
    delivery: string
    game: string
    platforms: string[]
  }
  id_category: string
  image_url: string
  name: string
  price: string
  product_id: string
  amount?: number // Extracted from name
}

interface GameInfo {
  category_name: string
  created_at: string
  description: {
    developer: string
    genre: string
    platforms: string[]
    release_year: number
    free_to_play?: boolean
  }
  id_category: string
  image_url: string
  name: string
  price: string
  product_id: string
}

@Component({
  selector: "app-game-coins",
  templateUrl: "./game-coins.page.html",
  styleUrls: ["./game-coins.page.scss"],
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
    IonButton,
    TabsPagesPage,
  ],
})
export class GameCoinsPage implements OnInit {
  gameName = "";
  isLoading = true;
  coinOptions: CoinOption[] = [];
  toastMessage: string | null = null;
  apiURL = "https://mg3hk6z5q4.execute-api.us-east-1.amazonaws.com/dev";

  // Nueva propiedad para almacenar la información del juego
  gameInfo: GameInfo | null = null;
  bannerImageUrl = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService,
    private toastController: ToastController
  ) {
    addIcons({ cartOutline, arrowBackOutline, homeOutline });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.gameName = params.get("game") || "";
      

      // Decodificar el nombre del juego si está codificado en la URL
      const decodedGameName = decodeURIComponent(this.gameName);
      this.gameName = decodedGameName;

      // Cargar la información del juego para el banner
      this.loadGameInfo(decodedGameName);

      // Cargar las opciones de monedas
      this.loadCoinOptions(decodedGameName);
    });
  }

  // Nuevo método para cargar la información del juego
  loadGameInfo(gameName: string) {
    const apiUrl = `${this.apiURL}/products/videogames`;
    

    this.http.get<GameInfo[]>(apiUrl).subscribe({
      next: (games) => {
     

        // Buscar el juego por nombre (ignorando mayúsculas/minúsculas)
        const game = games.find((g) => g.name.toLowerCase() === gameName.toLowerCase());

        if (game) {
          
          this.gameInfo = game;
          this.bannerImageUrl = game.image_url;
        } else {
        
          // Usar URL de respaldo para el banner
          this.bannerImageUrl = `https://d1th0hc7ymkxpv.cloudfront.net/games/Default_Banner.webp`;
        }
      },
      error: (err) => {
        console.error("Error loading game info:", err);
        // Usar URL de respaldo para el banner
        this.bannerImageUrl = `https://d1th0hc7ymkxpv.cloudfront.net/games/Default_Banner.webp`;
      },
    });
  }

  loadCoinOptions(game: string) {
    this.isLoading = true;

    // Usar la URL directa de la API
    const apiUrl = `${this.apiURL}/products/coins/${encodeURIComponent(game)}`;
    

    this.http.get<CoinOption[]>(apiUrl).subscribe({
      next: (data) => {
      

        if (data && data.length > 0) {
          this.coinOptions = data.map((coin) => {
            // Extract amount from name (e.g., "Fortnite V-Bucks 1000" -> 1000)
            const amountMatch = coin.name.match(/(\d+)(?:\s*$)/);
            const amount = amountMatch ? Number.parseInt(amountMatch[1]) : 0;

            return {
              ...coin,
              amount: amount,
            };
          });

          // Sort by amount (lowest to highest)
          this.coinOptions.sort((a, b) => (a.amount || 0) - (b.amount || 0));

        } else {
          console.log("No coin options returned from API");
          this.coinOptions = [];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Error loading coin options for ${game}:`, err);
        this.coinOptions = []; 
        this.isLoading = false;
      },
    });
  }

  addToCart(coin: CoinOption) {
    const added = this.cartService.addToCart({
      id: coin.product_id,
      name: coin.name,
      price: Number.parseFloat(coin.price),
      image_url: coin.image_url,
      quantity: 1,
    });

    if (added) {
      this.showToast(`${coin.name} added to cart`);
    } else {
      this.showToast(`${coin.name} is already in your cart`);
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  goToCart() {
    this.router.navigate(["/cart"]);
  }

  goBack() {
    this.router.navigate(["/menu"], { queryParams: { section: "coins" } });
  }
}

export default GameCoinsPage;
