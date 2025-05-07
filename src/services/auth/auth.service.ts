import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, from, switchMap } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private authState = new BehaviorSubject<boolean>(false);

    private apiURL = `${environment.apiURL}/auth`;

    constructor(private http: HttpClient, private httpHeader: HttpheaderService, private router: Router, private storage: StorageService) {}

    register(data: any): Observable<any>{
        const headers = this.httpHeader.getBasicJsonHeaders();
        return this.http.post(`${this.apiURL}/register`, data, { headers });
    }

    login(username: string, password: string): Observable<any>{
        const headers = this.httpHeader.getBasicJsonHeaders();
        const body = {username, password};
        console.log(headers)
        return this.http.post(`${this.apiURL}/login`, body, { headers });
    }

    changePassword(data: any): Observable<any>{
        return from(this.httpHeader.getJsonHeaders()).pipe(
            switchMap((headers) => {
                return this.http.post(`${this.apiURL}/changepassword`, data, { headers });
            })
          );
    }

    deactivateUser(data: any): Observable<any>{
        return from(this.httpHeader.getJsonHeaders()).pipe(
            switchMap((headers) => {
                return this.http.post(`${this.apiURL}/deactivateuser`, data, { headers });
            })
          );
    }

    async checkToken() {

        const token = await this.storage.getJwt();

        if (token && !this.isTokenExpired(token)) {

          this.authState.next(true);
          console.log('Session active');
        } else {
          this.router.navigate(['login']);
        }
      }
    isAuthenticated(): Observable<boolean> {
        return this.authState.asObservable();
      }
    
      isTokenExpired(token: string): boolean {
        try {
          const [, payload] = token.split('.');
          const decoded = JSON.parse(atob(payload));
          const now = Math.floor(Date.now() / 1000);
          return decoded.exp < now;
        } catch {
          return true;
        }
      }
}