import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';  // Your backend

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Book tickets for an event
  bookTickets(bookingData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, bookingData, {headers});
  }

  // Get booking history for a user
  getUserBookings(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/user/${userId}`, {headers});
  }

  // Organizer: Get bookings for an event
  getEventBookings(eventId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/event/${eventId}`, {headers});
  }
}
