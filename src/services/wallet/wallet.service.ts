import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wallet } from 'src/types';
import { HttpheaderService } from '../http-header/httpheader.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private apiURL = `${environment.apiURL}/wallet`

  constructor(private http: HttpClient, private httpHeader: HttpheaderService) { }

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getWalletBalance(userId: string): Observable<any> {
    return this.http.get(`${this.apiURL}/${userId}`, { headers: this.jsonHeaders });
  }

  /**
   * Deducts the specified amount from the user's wallet.
   * @param userId The ID of the user.
   * @param amount The amount to deduct.
   * @returns An Observable that emits the result of the deduction.
   */
  deductWalletBalance(userId: string, amount: number): Observable<any> {
    const body = { amount };
    return this.http.post(`${this.apiURL}/${userId}/deduct`, body, { headers: this.jsonHeaders });
  }

  async balance() {
    const headers = await this.httpHeader.getJsonHeaders();

    return this.http.get<Wallet>(`${this.apiURL}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching balance:', error);
        return throwError(() => error);
      })
    );
  }
}