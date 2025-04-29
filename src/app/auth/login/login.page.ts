import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { CartService } from "src/services/cart/cart.service"
import { IonCard, IonContent, IonButton, IonInput, AlertController, IonText} from "@ionic/angular/standalone"
import { Router } from "@angular/router"
import { AuthService } from "src/services/auth/auth.service"
import { UserService } from "src/services/user/user.service"
import { addIcons } from "ionicons"
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle } from "ionicons/icons"
import { StorageService } from "src/services/storage/storage.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule, ReactiveFormsModule, IonCard, IonButton, IonInput, IonText],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup
  showPassword = false

  constructor(
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private cartService: CartService,
  ) {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle });

    this.loginForm = this.fb.group({
      userName: ["", [Validators.required, Validators.maxLength(25)]],
      password: ["", [Validators.required, Validators.maxLength(50)]],
    })
  }
                           
  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  async onLogin() {

    if (this.loginForm.invalid) {
      return
    }

    const { userName: name, password: pass } = this.loginForm.value
  
    this.authService.login(name, pass).subscribe({
      next: async (response) => {
        console.log(response)
        if (response.token) {
          const token = response.token;
          await this.storageService.setJwt(token);
          this.userService.setCurrentUser({
            userName: name,
            fullName: name.toUpperCase(),
            email: `${name}@example.com`,
            profileImage: "https://ionicframework.com/docs/img/demos/avatar.svg",
          })
  
          // 🔥 Aquí cargas el carrito del usuario
          try {
            await this.cartService.refreshCart()
            console.log("Cart loaded successfully after login.")
          } catch (err) {
            console.error("Failed to load cart after login:", err)
          }
  
          this.router.navigateByUrl("home")
        } else {
          this.alert("Incorrect username or password", "Try again", "")
        }
      },
      error: (err) => {
        console.error(err)
        this.alert("Server error", "Please try again later", "")
      },
    })
  }
  

  onSignup() {
    this.router.navigateByUrl("signin")
  }

  async alert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    })

    await alert.present()
  }
}

export default LoginPage
