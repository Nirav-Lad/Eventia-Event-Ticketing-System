import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { EventService } from '../../services/event.service';  // Import EventService
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: any[] = [];  // Use an empty array initially
  userRole: string = 'user';  // Default to 'user'

  constructor(
    private authService: AuthService,
    private eventService: EventService,  // Inject EventService
    private router: Router
  ) {
    this.userRole = this.authService.getUserRole();  // Fetch user role from AuthService
    console.log(this.userRole);

    // Listen to route changes for debugging purposes
    this.router.events.subscribe(event => {
      console.log(event);  // Logs navigation events to help debug
    });
  }

  ngOnInit() {
    this.fetchEvents();  // Call the method to fetch events on component initialization
  }

  // Method to fetch events from the backend
  fetchEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        console.log('Events fetched successfully:', this.events);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
      complete: () => {
        console.log('Event fetch completed.');
      }
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
