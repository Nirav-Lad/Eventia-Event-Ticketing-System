import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';  // Your Node.js backend

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Register user/organizer
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  // Login user/organizer
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Get user role (store role after login for dashboard navigation)
  getUserRole(): string {
    return localStorage.getItem('role') || 'user';  // Use local storage or cookies
  }

  // Check if user is an organizer
  isOrganizer(): boolean {
    return this.getUserRole() === 'organizer';
  }

  // Logout user/organizer
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
