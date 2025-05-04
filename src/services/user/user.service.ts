import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { StorageService } from "../storage/storage.service"
import { environment } from "src/environments/environment";
import { HttpheaderService } from "../http-header/httpheader.service";
import { HttpClient } from "@angular/common/http";
import { Observable, from, switchMap } from "rxjs";


export interface User {
  id?: string
  userName: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  profileImage?: string
}

@Injectable({
  providedIn: "root",
})
export class UserService {

  private apiURL = `${environment.apiURL}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  userId$: any

  constructor(private storageSercice: StorageService, private http: HttpClient, private httpHeader: HttpheaderService) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  setCurrentUser(user: User): void {
    // Store user in localStorage and update the subject
    localStorage.setItem("currentUser", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
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
    this.currentUserSubject.next(null)
  }
}
