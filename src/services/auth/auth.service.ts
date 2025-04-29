import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from, switchMap } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private apiURL = `${environment.apiURL}/auth`;

    constructor(private http: HttpClient, private httpHeader: HttpheaderService) {}

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
}