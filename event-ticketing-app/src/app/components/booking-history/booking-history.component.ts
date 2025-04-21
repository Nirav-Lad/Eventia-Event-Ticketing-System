import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';  // Import BookingService
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent {
  bookings: any[] = [];  // User bookings

  constructor(private bookingService: BookingService) {
    this.loadBookingHistory();
  }

  // Fetch booking history for the current user
  loadBookingHistory() {
    const userId = localStorage.getItem('userId');  // Retrieve userId from localStorage
    if (userId) {
      this.bookingService.getUserBookings(userId).subscribe({
        next: (userBookings: any) => {
          this.bookings = userBookings;
          console.log(userBookings);
        },
        error: (error) => {
          console.error('Failed to load booking history:', error);
          alert('Error loading booking history.');
        }
      });
    } else {
      alert('You need to log in to view your bookings.');
    }
  }
  
}
