import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
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
} from "@ionic/angular/standalone"
import { Product } from "src/types"
import { ProductsService } from "src/services/products/products.service"
import { LocalNotifications } from "@capacitor/local-notifications"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"

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
    IonChip,
    IonLabel,
    IonIcon,
  ],
})
export class MenuPage implements OnInit {
  title = "Videogames"
  categories = ["Adventure", "Shooters", "Horror", "Action RPG"]
  selectedCategory: string | null = null

  products: Product[] = [
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
    {
      id: 3,
      name: "Little Nightmares II",
      description: "Little Nightmares II",
      price: 80.0,
      stock: 20,
      available: true,
      image_url:
        "https://back.panafoto.com/media/catalog/product/cache/22adb41f3f66ba957b3b3b7b0df44fe6/1/5/154973-001.jpg",
      create_at: "2024-02-25T12:45:00Z",
    },
    {
      id: 4,
      name: "Assassin's Creed Valhalla",
      description: "Assassin's Creed Valhalla",
      price: 60.0,
      stock: 8,
      available: true,
      image_url: "https://images.samsung.com/latin/galaxy-watch6/feature/galaxy-watch6-kv-pc.jpg",
      create_at: "2024-02-24T18:20:00Z",
    },
    {
      id: 5,
      name: "Laptop ASUS VivoBook",
      description: "Laptop ultraligera con procesador Intel Core i5 y 8GB de RAM.",
      price: 750.99,
      stock: 10,
      available: true,
      image_url: "https://www.multimax.net/cdn/shop/files/Asus_VivoBook_Go_15_OLED_AMD_Ryzen_5_7520U_8GB_RAM_512GB_SSD_15.6_Windows_11_Multimax_Panama_Computadoras_Dell_Lenovo_Apple_ASUS_MSI_Huawei_PSN0109624_1_1200x.jpg?v=1732564858",
      create_at: "2024-02-27T10:00:00Z"
    },
  ]

  constructor(
    private api_product: ProductsService,
    private alertController: AlertController,
  ) {
    // this.get_products()
  }

  ngOnInit() {}

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null
    } else {
      this.selectedCategory = category
    }
    // Here you would filter products by category
  }

  get_products(): void {
    this.api_product.getProducts().subscribe({
      next: (data) => {
        this.products = data
      },
      error: (err) => {
        this.alert()
        this.messageNotification()
        console.error("error al obtener los productos", err)
      },
    })
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
          schedule: { at: new Date(Date.now() + 1000) }, // para ue mande en un seunfo
          sound: "default",
        },
      ],
    })
  }
}