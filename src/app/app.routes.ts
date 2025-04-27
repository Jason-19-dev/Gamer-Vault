import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: "product-detail/:id",
    loadComponent: () => import("./product_details/product-detail.page").then((m) => m.ProductDetailPage),
  },
  {
    path: '',
    loadComponent: ()=> import('./auth/login/login.page').then(m=> m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu_/menu/menu.page').then( m => m.MenuPage)
  },
  {
    path: 'new-product',
    loadComponent: () => import('./menu_/new-product/new-product.page').then( m => m.NewProductPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signin',
    loadComponent: () => import('./auth/signin/signin.page').then( m => m.SigninPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./userpages/user/user.page').then( m => m.UserPage)
  },
  {
    path: 'tabs-pages',
    loadComponent: () => import('./tabs_bar/tabs-pages/tabs-pages.page').then( m => m.TabsPagesPage)
  },
  {
    path: 'wallet',
    loadComponent: () => import('./wallet/wallet.page').then( m => m.WalletPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart/cart.page').then( m => m.CartPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: "game-coins/:game",
    loadComponent: () => import("./game-coins/game-coins.page").then((m) => m.GameCoinsPage),
  },  {
    path: 'order-history',
    loadComponent: () => import('./order-history/order-history.page').then( m => m.OrderHistoryPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./change-password/change-password/change-password.page').then( m => m.ChangePasswordPage)
  }

]