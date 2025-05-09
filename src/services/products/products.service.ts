import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, from, switchMap } from 'rxjs';
import { CoinItem, GameItem } from 'src/types';
import { environment } from 'src/environments/environment';
import { HttpheaderService } from '../http-header/httpheader.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiURL}/products`;

  constructor(private http: HttpClient, private httpHeader: HttpheaderService) {}

  // GET products from external API
  public getProducts(): Observable<GameItem[]> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.get<GameItem[]>(`${this.apiUrl}/videogames`, { headers });
      }),
      catchError(this.handleError)
    );
  }

  public getCoins(): Observable<CoinItem[]> {
    return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
        return this.http.get<CoinItem[]>(`${this.apiUrl}/coins/games-list`, { headers });
      }),
      catchError(this.handleError)
    );
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.status === 0) {
      errorMessage = 'Network error: Por favor, verifica tu conexión a internet';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = `Client error: ${error.error.message || error.statusText}`;
    } else if (error.status >= 500) {
      errorMessage = `Server error: ${error.error.message || error.statusText}`;
    }
    console.error("API SERVICE:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}