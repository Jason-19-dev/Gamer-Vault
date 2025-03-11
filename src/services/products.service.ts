import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = 'http://localhost:8000/products'
  httpsOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http:HttpClient) { }
  // error handler 

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.status === 0) {
      errorMessage = 'Network error: Por favor, verifica tu conexión a internet';
    } else if (error.status >= 400 && error.status < 500) {
      // 404 Not Found)
      errorMessage = `Client error: ${error.error.message || error.statusText}`;
    } else if (error.status >= 500) {
      // Error del servidor
      errorMessage = `Server error: ${error.error.message || error.statusText}`;
    }
    console.error("API SERVICE:",errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  


  // GET
  public getProducts(): Observable<Product[]>{

    return this.http.get<Product[]>(this.url, this.httpsOptions).pipe(
      catchError(this.handleError)
    )
  }



}
