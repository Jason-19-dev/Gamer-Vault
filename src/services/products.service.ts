import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from 'src/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = 'http://localhost:8000/products';
  //externalApiUrl = 'https://3lf4j03yx8.execute-api.us-east-1.amazonaws.com/vi/products'; // API externa
  externalApiUrl = `${environment.apiURL}/products/videogames`;
  httpsOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

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

  // GET products from local API
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url, this.httpsOptions).pipe(
      catchError(this.handleError)
    );
  }

  // GET products from external API
  public getProductsFromExternalApi(): Observable<Product[]> {
    return this.http.get<Product[]>(this.externalApiUrl, this.httpsOptions).pipe(
      catchError(this.handleError)
    );
  }
}