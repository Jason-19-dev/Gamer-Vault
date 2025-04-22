import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private apiURL = `${environment.apiURL}/auth`;

    constructor(private http: HttpClient, private httpHeader: HttpheaderService) {}

    private get jsonHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    register(data: any): Observable<any>{
        const headers = this.httpHeader.getBasicJsonHeaders();
        return this.http.post(`${this.apiURL}/register`, data, { headers });
    }

    login(username: string, password: string): Observable<any>{
        const headers = this.httpHeader.getBasicJsonHeaders();
        const body = {username, password};
        console.log(headers);
        return this.http.post(`${this.apiURL}/login`, body, { headers });
    }
}