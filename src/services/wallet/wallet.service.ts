import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wallet } from 'src/types';
import { HttpheaderService } from '../http-header/httpheader.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private apiURL = `${environment.apiURL}/wallet`

  constructor(private http: HttpClient, private httpHeader: HttpheaderService) {}

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
