import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
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
} from "@ionic/angular/standalone";
import { Product } from "src/types";
import { TabsPagesPage } from "../tabs_bar/tabs-pages/tabs-pages.page";
import { addIcons } from "ionicons";
import { chevronForwardCircleOutline } from "ionicons/icons";
import { ProductsService } from "src/services/products.service";

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
  puntos = 6;
  saldo = 10.99;
  message = "";
  isAndroid = false;

  products: Product[] = []; // Inicializa como un arreglo vacío
  public results: Product[] = [];

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private router: Router, // Inyecta el Router
    private productsService: ProductsService // Inyecta el servicio
  ) {
    addIcons({ chevronForwardCircleOutline });
  }

  ngOnInit() {
    this.fetchProducts(); // Llama al método para obtener los productos al inicializar
  }

  // Método para obtener productos del servicio
  private fetchProducts() {
    this.productsService.getProductsFromExternalApi().subscribe({
      next: (data) => {
        this.products = data; // Asigna los productos obtenidos
        this.results = [...this.products]; // Inicializa los resultados para la búsqueda
        console.log("Productos obtenidos:", this.products);
      },
      error: (err) => {
        console.error("Error al obtener productos:", err.message);
      },
    });
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || "";

    this.results = this.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    if (this.results.length === 0) {
      this.message = "No Results";
    } else {
      this.message = "";
    }
  }

  getBrandFromName(name: string): string {
    if (name.includes("ASUS")) return "ASUS";
    if (name.includes("iPhone")) return "Apple";
    if (name.includes("Sony")) return "Sony";
    if (name.includes("Razer")) return "Razer";
    if (name.includes("Samsung")) return "Samsung";
    if (name.includes("Logitech")) return "Logitech";
    return "Brand";
  }

  // Método para navegar al menú
  navigateToMenu() {
    this.router.navigate(['/menu']); // Cambia '/menu' por la ruta deseada
  }
}