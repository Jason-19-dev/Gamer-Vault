import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { StorageService } from "../storage/storage.service"

export interface User {
  id?: string
  userName: string
  email?: string
  fullName?: string
  profileImage?: string
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  userId$: any

  constructor(private storageSercice: StorageService) {
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
    console.log('Token desde user.service:', token);

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

  clearCurrentUser(): void {
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }
}
