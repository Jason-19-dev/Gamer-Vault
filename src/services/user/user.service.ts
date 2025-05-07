import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { StorageService } from "../storage/storage.service"
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";
import { HttpClient } from "@angular/common/http";
import { Observable, from, switchMap } from "rxjs";


export type User = {
  avatar: string;
  birth_date: string; 
  created_at: string; 
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_id: string;
  username: string;
};


@Injectable({
  providedIn: "root",
})
export class UserService {

  private apiURL = `${environment.apiURL}/users`;
  currentUser: User | any = null

  constructor(private storageSercice: StorageService, private http: HttpClient, private httpHeader: HttpheaderService) {
    this.loadUserFromStorage()
    
  }

  private loadUserFromStorage(): void {

    const storedUser = localStorage.getItem("currentUser")

    if (storedUser) {
      this.currentUser = JSON.parse(storedUser)
    }

  }

  async loadCurrentUser(){

    const user_id = await this.getCurrentUserID()
    if (!user_id) return

    this.http.get<User>(`${this.apiURL}/${user_id}`).subscribe(
      (response) => {

        this.currentUser = response

        localStorage.setItem("currentUser", JSON.stringify(this.currentUser))

      },
      (error) => {
        console.error(error)
      }
    );  
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem("currentUser") || "null")
  }

  async getCurrentUserID(): Promise<string | null> {
    const token = await this.storageSercice.getJwt();

    if (!token) return null;

    try {
      const payloadString = atob(token.split('.')[1]);
     
      const payload = JSON.parse(payloadString);

      return payload.sub || null;
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }

  
getUserLevel(data: any): Observable<any>{
  return from(this.httpHeader.getJsonHeaders()).pipe(
      switchMap((headers) => {
          return this.http.post(`${this.apiURL}/getlevel`, data, { headers });
      })
    );
}

  clearCurrentUser(): void {
    localStorage.removeItem("currentUser")
    this.currentUser = {}
  }
}
