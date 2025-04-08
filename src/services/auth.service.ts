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

    private get jsonHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    register(data: any): Observable<any>{
        return this.http.post(`${this.apiURL}/register`, data, { headers: this.jsonHeaders });
    }

    login(username: string, password: string): Observable<any>{
        const body = {username, password};
        return this.http.post(`${this.apiURL}/login`, body, { headers: this.jsonHeaders });
    }
}