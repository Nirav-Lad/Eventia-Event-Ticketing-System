import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';  
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId: string | null = null;
  event = { 
    title: '', 
    date: '', 
    description: '', 
    location: '', 
    ticketPrice: 0, 
    qrCodeImage: '' 
  };
  
  tickets = 1;
  totalAmount = 0;  // New variable for total amount

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.eventId = paramMap.get('id');
      if (this.eventId) {
        this.loadEventDetails();
      } else {
        console.error('Event ID is null or undefined');
      }
    });
  }

  loadEventDetails() {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (eventDetails: any) => {
          this.event = eventDetails;
          this.calculateTotalAmount(); // Calculate total amount when event details are loaded
        },
        error: (error) => {
          console.error('Failed to load event details:', error);
          alert('Error loading event details.');
        }
      });
    }
  }

  calculateTotalAmount() {
    this.totalAmount = this.tickets * this.event.ticketPrice;
  }

  bookTickets() {
    const userId = localStorage.getItem('userId');
    if (userId && this.eventId) {
      const bookingData = { 
        userId, 
        eventId: this.eventId, 
        tickets: this.tickets, 
        totalAmount: this.totalAmount 
      };
      this.bookingService.bookTickets(bookingData).subscribe({
        next: (response: any) => {
          alert(`Booking successful! Total Amount: ₹${this.totalAmount}`);
          this.loadEventDetails();
        },
        error: (error) => {
          console.error('Booking failed:', error);
          alert(error.error.message || 'Error booking tickets.');
        }
      });
    } else {
      alert('You need to log in to book tickets.');
    }
  }
}
