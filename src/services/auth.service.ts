import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private apiURL = `${environment.apiURL}/users`;

    constructor(private http: HttpClient) {}

    login(userName: string, password: string): Observable<any>{
        const body = {userName, password};
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(this.apiURL, body, { headers });
    }
}