import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  private cartItems: any[] = [
    {
      id: 1,
      name: "Laptop ASUS VivoBook",
      description: "Laptop ultraligera con procesador Intel Core i5 y 8GB de RAM.",
      price: 50,
      stock: 10,
      available: true,
      image_url: "https://www.multimax.net/cdn/shop/files/Asus_VivoBook_Go_15_OLED_AMD_Ryzen_5_7520U_8GB_RAM_512GB_SSD_15.6_Windows_11_Multimax_Panama_Computadoras_Dell_Lenovo_Apple_ASUS_MSI_Huawei_PSN0109624_1_1200x.jpg?v=1732564858",
      create_at: "2024-02-27T10:00:00Z",
      quantity:1
  },
  {
      id: 2,
      name: "iPhone 15 Pro",
      description: "Smartphone de alta gama con chip A17 y cámara de 48 MP.",
      price: 100,
      stock: 5,
      available: true,
      image_url: "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-color-lineup-230912_big.jpg.large.jpg",
      create_at: "2024-02-26T15:30:00Z",
      quantity:2
  },
  {
      id: 3,
      name: "Audífonos Sony WH-1000XM5",
      description: "Audífonos con cancelación de ruido y batería de 30 horas.",
      price: 50,
      stock: 20,
      available: true,
      image_url: "https://www.sony.com.pa/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=165&bgcolor=FFFFFF&bgc=FFFFFF",
      create_at: "2024-02-25T12:45:00Z",
      quantity:1
  },
  {
      id: 4,
      name: "Silla Gamer Razer",
      description: "Silla ergonómica con ajuste lumbar y reposabrazos 4D.",
      price: 250,
      stock: 8,
      available: true,
      image_url: "https://back.panafoto.com/media/catalog/product/cache/22adb41f3f66ba957b3b3b7b0df44fe6/1/5/154973-001.jpg",
      create_at: "2024-02-24T18:20:00Z",
      quantity:1
  },
  {
      id: 5,
      name: "Samsung Galaxy Watch 6",
      description: "Reloj inteligente con monitor de salud y pantalla AMOLED.",
      price: 500,
      stock: 15,
      available: true,
      image_url: "https://images.samsung.com/latin/galaxy-watch6/feature/galaxy-watch6-kv-pc.jpg",
      create_at: "2024-02-23T09:10:00Z",
      quantity:1
  },
  
  ]

  getCartItems() {
    return this.cartItems;
  }

  
  addToCart(product: any) {
    const product_exist = this.cartItems.find(item => item.id === product.id);
    if (product_exist) {
      product_exist.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
  }

  removeCart(product: any) {

    const index = this.cartItems.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
  }
}
