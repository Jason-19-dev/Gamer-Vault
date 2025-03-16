import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
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
  }

];
