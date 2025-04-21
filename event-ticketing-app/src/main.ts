import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, Route, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Event, NavigationStart, Router, RouterEvent } from '@angular/router';
import { inject } from '@angular/core';

// Import your components
import { HomeComponent } from './app/components/home/home.component';
import { AuthenticationComponent } from './app/components/authentication/authentication.component';
import { EventDetailsComponent } from './app/components/event-details/event-details.component';
import { BookingHistoryComponent } from './app/components/booking-history/booking-history.component';
import { OrganizerEventsComponent } from './app/components/organizer-events/organizer-events.component';

// Define your routes
const routes: Route[] = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthenticationComponent },
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'booking-history', component: BookingHistoryComponent },
  { path: 'organizer-events', component: OrganizerEventsComponent },
  { path: 'home', component: HomeComponent },  // Ensure this is above the wildcard
  { path: '**', redirectTo: 'auth' }           // Wildcard route at the end
];


// Custom tracing function to log router events
function setupRouterTracing(router: Router) {
  router.events.subscribe((event: Event) => {
    // Narrow the event type to handle specific Router events
    if (event instanceof NavigationStart) {
      console.log('Navigation started to:', event.url);
    } else if (event instanceof RouterEvent) {
      // Handle other router events if needed
      console.log('Router event:', event);
    }
  });
}

// Bootstrap the application with the AppComponent and the router configuration
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withRouterConfig({})), // Standalone routing
    provideHttpClient(),
    {
      provide: 'RouterTracing',
      useFactory: () => setupRouterTracing(inject(Router))
    },
    ...appConfig.providers
  ]
}).catch((err) => console.error(err));
