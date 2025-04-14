import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  AlertController,
} from "@ionic/angular/standalone"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import {
  pencilOutline,
  timeOutline,
  cardOutline,
  lockClosedOutline,
  logOutOutline,
  trashOutline,
  linkOutline,
  shieldOutline,
  helpCircleOutline,
} from "ionicons/icons"
import { UserService, type User } from "src/services/user/user.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    CommonModule,
    FormsModule,
    IonToolbar,
    TabsPagesPage,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
  ],
})
export class UserPage implements OnInit, OnDestroy {
  currentUser: User | null = null
  private userSubscription: Subscription | null = null

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
  ) {
    // Register Ionicons
    addIcons({pencilOutline, timeOutline, cardOutline, lockClosedOutline, logOutOutline, trashOutline, linkOutline, shieldOutline, helpCircleOutline});
  }

  ngOnInit() {
    // Get current user
    this.currentUser = this.userService.getCurrentUser()

    // Subscribe to user changes
    this.userSubscription = this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })

    // If no user is logged in, redirect to login
    if (!this.currentUser) {
      this.router.navigateByUrl("/login")
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }

  editProfile() {
    console.log("Edit profile clicked")
  }

  async logout() {
    const alert = await this.alertController.create({
      header: "Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Logout",
          handler: () => {
            // Clear user data and redirect to login
            this.userService.clearCurrentUser()
            this.router.navigateByUrl("/login")
          },
        },
      ],
    })

    await alert.present()
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: "Delete Account",
      message: "Are you sure you want to delete your account? This action cannot be undone.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          cssClass: "alert-button-danger",
          handler: () => {
            // Clear user data and redirect to login
            this.userService.clearCurrentUser()
            this.router.navigateByUrl("/login")
          },
        },
      ],
    })

    await alert.present()
  }

  orderHistory() {
    console.log("Order history clicked")
    // Navigate to order history page
  }

  managePayment() {
    console.log("Manage payment methods clicked")
    // Navigate to payment methods page
  }

  changePassword() {
    console.log("Change password clicked")
    // Navigate to change password page
  }
}

export default UserPage
