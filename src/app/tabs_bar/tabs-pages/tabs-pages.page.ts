import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonNote, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@Component({
  selector: 'app-tabs-pages',
  templateUrl: './tabs-pages.page.html',
  styleUrls: ['./tabs-pages.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonTabBar,
    IonTabButton,
    IonIcon,
    RouterLink,
    
  ]
})
export class TabsPagesPage implements OnInit {

  constructor() { 
    addIcons(icons);

  }

  ngOnInit() {
  }

}

