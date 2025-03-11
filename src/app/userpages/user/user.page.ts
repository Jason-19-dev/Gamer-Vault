import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonMenuButton, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TabsPagesPage } from 'src/app/tabs_bar/tabs-pages/tabs-pages.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
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
    IonSegment,
    IonSegmentButton,
    IonSegmentView,
    IonSegmentContent,
    IonAvatar
  ]
})
export class UserPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
