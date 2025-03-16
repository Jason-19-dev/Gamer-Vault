import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonList } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common'; 

@Component({
  selector: 'app-coins',
  templateUrl: './coins.page.html',
  styleUrls: ['./coins.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonLabel, IonItem, IonList, NgFor]
})
export class CoinsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  Integrantes = ['Jason Dereck', 'Adriana Andrea', 'Jeremy', 'Carlos', 'Jack']

}
