import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonToggle, IonLabel, IonItem, IonInput, IonBackButton, IonButtons, IonAvatar, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { TabsPagesPage } from 'src/app/tabs_bar/tabs-pages/tabs-pages.page';
import { type User, UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, IonAvatar, IonButtons, IonBackButton, IonInput,IonItem, IonLabel, IonToggle, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TabsPagesPage]
})
export class MyprofilePage implements OnInit {

  currentUser: User | any = null

  constructor( private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();

    
  }


  shooseImage() {
    console.log("Choose image clicked");
  }
}
