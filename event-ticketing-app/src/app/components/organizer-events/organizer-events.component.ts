import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrganizerEventDetailsComponent } from '../organizer-event-details-component/organizer-event-details-component.component';

@Component({
  selector: 'app-organizer-events',
  standalone: true,
  imports: [CommonModule, FormsModule, OrganizerEventDetailsComponent],
  templateUrl: './organizer-events.component.html',
  styleUrls: ['./organizer-events.component.css']
})
export class OrganizerEventsComponent {
  organizerEvents: any[] = [];
  isCreateFormVisible: boolean = false;  // Toggle for the create event form
  isEditFormVisible: boolean = false;  // Toggle for the edit event form
  selectedEvent: any = null; // Store the event to be edited
  selectedEventId: string | null = null;

  // Properties for new event details
  newEventTitle: string = '';
  newEventDescription: string = '';
  newEventDate: string = '';
  newEventLocation: string = '';
  newEventCapacity: number | null = null;

  ticketPrice: number = 0;
  selectedFile: File | null = null;
  qrCodePreview: string | ArrayBuffer | any=null;
  qrCodepath:string|any=null;

  constructor(private eventService: EventService, private http:HttpClient,private authService: AuthService, private router: Router) {
    this.loadOrganizerEvents();
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Create file preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.qrCodePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Fetch events created by the organizer
  loadOrganizerEvents() {
    this.eventService.getOrganizerEvents().subscribe({
      next: (events: any) => {
        this.organizerEvents = events;
      },
      error: (error) => {
        console.error('Failed to load organizer events:', error);
        alert('Error loading events.');
      }
    });
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        alert('Event deleted!');
        this.organizerEvents = this.organizerEvents.filter(event => event._id !== eventId);
      },
      error: (error) => {
        console.error('Event deletion failed:', error);
        alert('Error deleting event.');
      }
    });
  }

  // Toggle the event creation form
  toggleCreateEventForm() {
    this.isCreateFormVisible = !this.isCreateFormVisible;
  }

  // Create a new event with form input values
  createEvent() {
    const formData = new FormData();
    formData.append('ticketPrice', this.ticketPrice.toString());
  
    if (this.selectedFile) {
      formData.append('qrCode', this.selectedFile);
    }
  
    this.http.post<{ filePath: string }>('http://localhost:5000/api/uploadQrCode', formData)
      .subscribe({
        next: (response) => {
          console.log('QR Code uploaded:', response);
          console.log('QR Code path:', response.filePath);
          this.qrCodepath=response.filePath
  
          // Assuming response has filePath for the stored QR code path
          const newEvent = {
            title: this.newEventTitle,
            description: this.newEventDescription,
            date: this.newEventDate,
            location: this.newEventLocation,
            capacity: this.newEventCapacity,
            ticketPrice: this.ticketPrice,
            qrCodeImage: this.qrCodepath, // Store path here
          };
  
          // Call the event creation service
          this.eventService.createEvent(newEvent).subscribe({
            next: () => {
              alert('New event created!');
              this.loadOrganizerEvents();
              this.isCreateFormVisible = false;
              this.resetForm();
            },
            error: (error) => {
              console.error('Event creation failed:', error);
              alert('Error creating event.');
            }
          });
        },
        error: (error) => {
          console.error('QR Code upload failed:', error);
          alert('Error uploading QR Code.');
        }
      });
  }
  
  

  // Clear the form after creating an event
  resetForm() {
    this.newEventTitle = '';
    this.newEventDescription = '';
    this.newEventDate = '';
    this.newEventLocation = '';
    this.newEventCapacity = null;
  }

  // Open the edit form with the selected event's details
  // Open the edit form with the selected event's details
  editEvent(event: any) {
    if (!event || !event._id) {
      console.error('Selected event or event ID is missing when opening edit form');
      alert('Selected event or event ID is missing.');
      return;
    }
    this.selectedEvent = { ...event }; // Clone the event data to avoid two-way binding issues
    this.isEditFormVisible = true;
  }
  

// Update the selected event
updateEvent() {
  if (!this.selectedEvent || !this.selectedEvent._id) {
    console.error('Selected event or event ID is missing during update');
    alert('Selected event or event ID is missing.');
    return;
  }

  if (this.selectedFile) {
    // If a new QR code is selected, upload it first
    const formData = new FormData();
    formData.append('qrCode', this.selectedFile);

    this.http.post<{ qrCodePath: string }>('http://localhost:5000/api/uploadQrCode', formData)
      .subscribe({
        next: (response) => {
          // Set the new QR code path
          this.selectedEvent.qrCodeImage = response.qrCodePath;
          this.finalizeEventUpdate();
        },
        error: (error) => {
          console.error('QR Code upload failed:', error);
          alert('Error updating QR Code.');
        }
      });
  } else {
    // No new file selected, proceed to update event directly
    this.finalizeEventUpdate();
  }

  this.eventService.updateEvent(this.selectedEvent._id, this.selectedEvent).subscribe({
    next: () => {
      alert('Event updated!');
      this.loadOrganizerEvents();
      this.isEditFormVisible = false;
      this.selectedEvent = null;
    },
    error: (error) => {
      console.error('Event update failed:', error);
      alert('Error updating event.');
    }
  });
}

// Helper method to finalize the event update
finalizeEventUpdate() {
  this.eventService.updateEvent(this.selectedEvent._id, this.selectedEvent).subscribe({
    next: () => {
      alert('Event updated!');
      this.loadOrganizerEvents();
      this.isEditFormVisible = false;
      this.selectedEvent = null;
    },
    error: (error) => {
      console.error('Event update failed:', error);
      alert('Error updating event.');
    }
  });
}


  // Cancel the edit form
  cancelEdit() {
    this.isEditFormVisible = false;
    this.selectedEvent = null;
  }

  // Show event details
  showEventDetails(eventId: string) {
    this.selectedEventId = eventId;
  }

  // Hide event details
  hideEventDetails() {
    this.selectedEventId = null;
  }

  // Method to close the modal
  closeModal() {
    this.selectedEventId = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
