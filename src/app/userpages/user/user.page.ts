import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
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
} from "@ionic/angular/standalone"
import { TabsPagesPage } from "src/app/tabs_bar/tabs-pages/tabs-pages.page"
import { addIcons } from "ionicons"
import {
  pencilOutline,
  linkOutline,
  shieldOutline,
  lockClosedOutline,
  helpCircleOutline,
  trashOutline,
  logOutOutline,
} from "ionicons/icons"

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
    IonInput,
    IonToolbar,
    TabsPagesPage,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
  ],
})
export class UserPage implements OnInit {
  constructor() {
    // Register Ionicons
    addIcons({
      "pencil-outline": pencilOutline,
      "link-outline": linkOutline,
      "shield-outline": shieldOutline,
      "lock-closed-outline": lockClosedOutline,
      "help-circle-outline": helpCircleOutline,
      "trash-outline": trashOutline,
      "log-out-outline": logOutOutline,
    })
  }

  ngOnInit() {}

  editProfile() {
    console.log("Edit profile clicked")
  }

  deleteAccount() {
    console.log("Delete account clicked")
  }
}

