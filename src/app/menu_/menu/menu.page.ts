import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Product } from 'src/types';
import { ProductsService } from 'src/services/products.service';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { notifications } from 'ionicons/icons';
import { TabsPagesPage } from 'src/app/tabs_bar/tabs-pages/tabs-pages.page';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonHeader,
    TabsPagesPage,
    IonTitle
  ]
})
export class MenuPage implements OnInit {
  title = 'La Casita Restaurant & Garden'
  products: Product[] = [
    {
      id: 1,
      name: "Laptop ASUS VivoBook",
      description: "Laptop ultraligera con procesador Intel Core i5 y 8GB de RAM.",
      price: 750.99,
      stock: 10,
      available: true,
      image_url: "https://www.multimax.net/cdn/shop/files/Asus_VivoBook_Go_15_OLED_AMD_Ryzen_5_7520U_8GB_RAM_512GB_SSD_15.6_Windows_11_Multimax_Panama_Computadoras_Dell_Lenovo_Apple_ASUS_MSI_Huawei_PSN0109624_1_1200x.jpg?v=1732564858",
      create_at: "2024-02-27T10:00:00Z"
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      description: "Smartphone de alta gama con chip A17 y cámara de 48 MP.",
      price: 999.99,
      stock: 5,
      available: true,
      image_url: "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-color-lineup-230912_big.jpg.large.jpg",
      create_at: "2024-02-26T15:30:00Z"
    },
    {
      id: 3,
      name: "Audífonos Sony WH-1000XM5",
      description: "Audífonos con cancelación de ruido y batería de 30 horas.",
      price: 349.99,
      stock: 20,
      available: true,
      image_url: "https://www.sony.com.pa/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=165&bgcolor=FFFFFF&bgc=FFFFFF",
      create_at: "2024-02-25T12:45:00Z"
    },
    {
      id: 4,
      name: "Silla Gamer Razer",
      description: "Silla ergonómica con ajuste lumbar y reposabrazos 4D.",
      price: 259.99,
      stock: 8,
      available: true,
      image_url: "https://back.panafoto.com/media/catalog/product/cache/22adb41f3f66ba957b3b3b7b0df44fe6/1/5/154973-001.jpg",
      create_at: "2024-02-24T18:20:00Z"
    },
    {
      id: 5,
      name: "Samsung Galaxy Watch 6",
      description: "Reloj inteligente con monitor de salud y pantalla AMOLED.",
      price: 299.99,
      stock: 15,
      available: true,
      image_url: "https://images.samsung.com/latin/galaxy-watch6/feature/galaxy-watch6-kv-pc.jpg",
      create_at: "2024-02-23T09:10:00Z"
    },
    {
      id: 6,
      name: "Teclado Mecánico Logitech G Pro",
      description: "Teclado mecánico RGB con switches GX Blue táctiles.",
      price: 129.99,
      stock: 12,
      available: true,
      image_url: "https://cdn.panacompu.com/cdn-img/pv/gallery-2-pro-x-tkl-black-lightspeed-gaming-keyboard.jpg-.jpg?width=1200&height=630&fixedwidthheight=true",
      create_at: "2024-02-22T14:05:00Z"
    },
    {
      id: 7,
      name: "Monitor LG UltraGear 27''",
      description: "Monitor gaming de 144Hz con panel IPS y 1ms de respuesta.",
      price: 299.99,
      stock: 7,
      available: true,
      image_url: "https://m.media-amazon.com/images/I/516mTvrJf8L._AC_UF894,1000_QL80_.jpg",
      create_at: "2024-02-21T16:30:00Z"
    },
    {
      id: 8,
      name: "Mouse Razer DeathAdder V3",
      description: "Mouse ergonómico con sensor óptico de 30K DPI.",
      price: 79.99,
      stock: 25,
      available: true,
      image_url: "https://assets2.razerzone.com/images/og-image/razer-deathadder-v3-pro-og-image.png",
      create_at: "2024-02-20T11:15:00Z"
    },
    {
      id: 9,
      name: "Cámara GoPro HERO12",
      description: "Cámara de acción con grabación en 5.3K y estabilización HyperSmooth.",
      price: 429.99,
      stock: 6,
      available: true,
      image_url: "https://www.multimax.net/cdn/shop/files/h12_2_1200x.png?v=1706303144",
      create_at: "2024-02-19T08:40:00Z"
    },
    {
      id: 10,
      name: "Xbox Series X",
      description: "Consola de nueva generación con 1TB de almacenamiento SSD.",
      price: 499.99,
      stock: 9,
      available: true,
      image_url: "https://unicapanama.com/cdn/shop/files/ConsolaMicrosoftXboxSeriesS1TBSSDNegra_1080x.png?v=1718378857",
      create_at: "2024-02-18T17:25:00Z"
    }
  ];


  constructor(
    private api_product: ProductsService,
    private alertController: AlertController) {
    // this.get_products()
  }

  ngOnInit() {
  }

  get_products(): void {
    this.api_product.getProducts().subscribe({
      next: (data) => {
        this.products = data
      },
      error: err => {
        this.alert()
        this.messageNotification()
        console.error('error al obtener los productos', err)
      }
    });
  }

  async alert() {
    const alert = await this.alertController.create({
      header: 'API FAIL',
      subHeader: "",
      message: "Error al obtener los productos",
      buttons: ['OK'],
    });

    await alert.present();

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
        }
      ]
    })
  }



}



