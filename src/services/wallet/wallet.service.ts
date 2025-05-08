import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, from, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wallet } from 'src/types';
import { HttpheaderService } from '../http-header/httpheader.service';
import { HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private apiURL = `${environment.apiURL}/wallet`

  constructor(private http: HttpClient, private httpHeader: HttpheaderService) { }

  getWalletBalance(userId: string): Observable<any> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
          switchMap((headers) => {
            return this.http.get(`${this.apiURL}/${userId}`, { headers });
          }));
  }

  /**
   * Deducts the specified amount from the user's wallet.
   * @param userId The ID of the user.
   * @param amount The amount to deduct.
   * @returns An Observable that emits the result of the deduction.
   */
  deductWalletBalance(userId: string, amount: number): Observable<any> {
    const body = { amount };
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.post(`${this.apiURL}/${userId}/deduct`, body, { headers });
      }));

  }
  load_user_interest_history(userId: string): Observable<any> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.get(`${environment.apiURL}/wallet/${userId}/history`, { headers });
      })
    );
  }

  // async balance() {
  //   const headers = await this.httpHeader.getJsonHeaders();

  //   return this.http.get<Wallet>(`${this.apiURL}`, { headers }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching balance:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
}