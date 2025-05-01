import { Component } from "@angular/core"
import { IonApp, IonRouterOutlet, Platform, IonSpinner } from "@ionic/angular/standalone"
import { StatusBar, Style } from "@capacitor/status-bar"
import { SplashScreen } from "@capacitor/splash-screen"
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { NgIf } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonSpinner, IonApp, IonRouterOutlet, NgIf],
})
export class AppComponent {
  showSplash = true;
  constructor(private platform: Platform) {
    this.initializeApp()
    this.showSplashScreen();
  }

  async initializeApp() {
    await this.platform.ready()

    try {
      // Configurar la barra de estado
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: "#0a1933" })
      await StatusBar.setOverlaysWebView({ overlay: false })
      await ScreenOrientation.lock({ orientation: 'portrait' });

      // Ocultar la pantalla de splash
      await SplashScreen.hide()
    } catch (err) {
      console.log("Esta funcionalidad solo está disponible en dispositivos nativos", err)
    }
  }
  
  showSplashScreen() {
    setTimeout(() => {
      this.showSplash = false;
    },1000);
  }
  
}