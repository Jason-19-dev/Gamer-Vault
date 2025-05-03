import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from, switchMap } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor( private http: HttpClient, private httpHeader: HttpheaderService) { }

  private apiURL = `${environment.apiURL}/orders`

  create_new_order(data: any): Observable<any> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.post(`${this.apiURL}`, data, { headers });
      })
    );
  }

  load_user_orders(userId: string): Observable<any> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.get(`${environment.apiURL}/orders/${userId}`, { headers });
      })
    );
  }

  getOrderDescription(orderId: string): Observable<any> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        console.log(headers)
        return this.http.get(`${this.apiURL}/detail/${orderId}`, { headers });
      })
    );
  }
}