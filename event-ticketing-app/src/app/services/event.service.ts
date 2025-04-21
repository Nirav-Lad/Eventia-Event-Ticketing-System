import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';  // Node.js backend API

  constructor(private http: HttpClient) {}

  // Fetch all events
  getAllEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch event details by ID
  getEventById(eventId: string): Observable<any> {
    console.log(`Fetching event with ID: ${eventId}`);
    return this.http.get(`${this.apiUrl}/${eventId}`);
  }

  getEventByIdOrganizer(eventId: string): Observable<any> {
    console.log(`Fetching event with ID: ${eventId}`);
    return this.http.get(`${this.apiUrl}/${eventId}/organizer`);
  }
  
  // Organizer: Create a new event
  createEvent(eventData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, eventData, {headers});
  }

  // Organizer: Update an event
  updateEvent(eventId: string, updatedData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${eventId}`, updatedData, { headers });
  }
  
  // Organizer: Get events created by this organizer
  getOrganizerEvents(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/my-events`, { headers });  // Assuming the backend handles the organizer's events
  }

  // Organizer: Delete an event
  deleteEvent(eventId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${eventId}`, { headers });
  }

}