import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private apiURL = `${environment.apiURL}/auth`;

    constructor(private http: HttpClient) {}

    register(data: any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(`${this.apiURL}/register`, data, { headers });
    }

    login(username: string, password: string): Observable<any>{
        const body = {username, password};
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(`${this.apiURL}/login`, body, { headers });
    }
}