import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"


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

  constructor() {
    // Load user from localStorage on service initialization
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

  getCurrentUserID(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('Token desde user.service:', token);
    
    if (!token) return null;

    try {
      const payloadString = atob(token.split('.')[1]);
      console.log('Payload decodificado:', payloadString);
      const payload = JSON.parse(payloadString);
      console.log('Payload como objeto:', payload);
      return payload.user_id || null;
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }

  clearCurrentUser(): void {
    // Remove user from localStorage and update the subject
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }
}
