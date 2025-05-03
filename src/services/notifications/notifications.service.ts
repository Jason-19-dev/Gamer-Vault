import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { User, UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  currentUser: User | null = null
  private url = `${environment.apiURL}/notifications`;
  private messages = [
    'Purchase successful and you saved $X!',
    'Congratulations! Your purchase was successful and you saved $X. Keep it up!',
    'You saved while shopping! You saved $X on your last purchase.',
    'Purchase confirmed + savings activated. Smart move — you saved $X.',
    'Purchase completed. And the best part... you saved $X!',
    'Thanks for your purchase. Plus, you saved $X this time.',
  ];
  
  constructor( private http: HttpClient, private userService: UserService) { }

  messageNotification( title: string, message: string ) {
    const notifyId = new Date().getTime();

    LocalNotifications.schedule({
      notifications: [
        {
          id: notifyId,
          title: title,
          body: message,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'default',
        },
      ],
    });
  }

  notifyPurchaseWithSavings(ahorro: number) {
    const rmsg= this.messages[Math.floor(Math.random() * this.messages.length)];
    const msg = rmsg.replace('$X', `$${ahorro.toFixed(2)}`);
    this.messageNotification('🛍️ ¡Successful purchase!', msg);
  }

  apiNotify(type: string) {

    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) return;

    setInterval(() => {
      
      this.http.post(this.url, {type: type, user: this.currentUser?.userName} ).subscribe(
        (response: any) => {
          const body = JSON.parse(response.body)
          console.log(body.title);
          this.messageNotification(body.title, body.message);
        });

    }, 6 * 60 * 60 * 1000);
  } 

  initNotifications() {
    this.apiNotify('remaint');
    this.apiNotify('new');
    this.apiNotify('invitation');
  }
  
 
  
}
