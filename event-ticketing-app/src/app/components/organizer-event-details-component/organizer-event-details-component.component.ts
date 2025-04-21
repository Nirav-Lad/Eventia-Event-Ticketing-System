import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-organizer-event-details-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-event-details-component.component.html',
  styleUrl: './organizer-event-details-component.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizerEventDetailsComponent implements OnInit {
  @Input() eventId: string | undefined;
  @Output() close = new EventEmitter<void>();

  eventDetails: any = {}; // Store event details
  bookings: any[] = [];
  totalTickets: number = 0;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEventDetails();
  }

  loadEventDetails() {
    if (this.eventId) {
      this.eventService.getEventByIdOrganizer(this.eventId).subscribe({
        next: (response: any) => {
          this.eventDetails = response.event;
          this.bookings = response.bookings;
          this.totalTickets = response.bookings.length;
          console.log('Event details:', this.eventDetails);
          console.log('Bookings:', this.bookings);
        },
        error: (error) => {
          console.error('Error fetching event details and bookings:', error);
        }
      });
    } else {
      console.error('Event ID is undefined');
    }
  }

  closeModal() {
    this.close.emit();
  }
}
