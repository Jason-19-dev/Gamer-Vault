import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor( private http: HttpClient) { }

  private apiURL = `${environment.apiURL}/orders`

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  create_new_order(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}`, data, { headers: this.jsonHeaders });
  }

  load_user_orders(userId: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/orders/${userId}`, { headers: this.jsonHeaders });
  }

  getOrderDescription(orderId: string): Observable<any> {
    return this.http.get(`${this.apiURL}/detail/${orderId}`, { headers: this.jsonHeaders });
  }
}