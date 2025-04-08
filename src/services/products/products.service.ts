import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from 'src/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiURL}/products/`;

  constructor(private http: HttpClient) {}

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // GET products from external API
  public getProductsFromExternalApi(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/videogames`, { headers : this.jsonHeaders }).pipe(
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