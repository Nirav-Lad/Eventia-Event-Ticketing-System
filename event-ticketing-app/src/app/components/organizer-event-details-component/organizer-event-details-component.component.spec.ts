import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventDetailsComponentComponent } from './organizer-event-details-component.component';

describe('OrganizerEventDetailsComponentComponent', () => {
  let component: OrganizerEventDetailsComponentComponent;
  let fixture: ComponentFixture<OrganizerEventDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventDetailsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEventDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
