import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, AlertController, IonSearchbar, IonList, IonLabel, IonItem, IonNote, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { Product } from 'src/types';
import { RouterLink } from '@angular/router';
import { TabsPagesPage } from '../tabs_bar/tabs-pages/tabs-pages.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
  ]
})
export class HomePage implements OnInit {

  constructor(private alertController: AlertController) {
    // this.welcome()
    
  }

  ngOnInit() {
  }
  title = "Gamer Vault"
  puntos = 6
  saldo = 10.99
  message = ''
  // async welcome() {
  //   const alert = await this.alertController.create({
  //     header: 'Bienvenido!',
  //     subHeader: "",
  //     message: "",
  //     buttons: ['Ok'],
  //   });

  //   await alert.present();
  // }
 
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
  ]


  public results = [...this.products]; 

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement; 
    const query = target.value?.toLowerCase() || ''; 
  
    this.results = this.products.filter((product) => product.name.toLowerCase().includes(query));
    console.log(this.results)
    // console.log(target)
    console.log(query)

    if (this.results.length === 0) {
      this.message = 'No Results';
    } else {
      this.message = ''; 
    }
  }
}
