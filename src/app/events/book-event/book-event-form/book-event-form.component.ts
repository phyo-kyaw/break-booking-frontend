import { Component, OnInit } from '@angular/core';

import * as dayjs from 'dayjs';
import { EventBookingService } from 'app/service/event-booking/event-booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-book-event-form',
  templateUrl: './book-event-form.component.html',
  styleUrls: ['./book-event-form.component.css']
})
export class BookEventFormComponent implements OnInit {
  paymentStatus: string = 'Getting payment information...';

  dropUiInstance = null;
  dropUiCreateError = null;
  error = '';
  isError = false;
  isLoading = true;
  loadingScreenText = 'Getting payment information...';
  eid: string;
  eventDetail = null;
  isLoggedIn: boolean = false;

  userProfile: any = '';

  userRoles: string[] = [];

  constructor(
    private eventBookingService: EventBookingService,
    private ActivatedRoute: ActivatedRoute,
    protected readonly keycloakService: KeycloakService,
    private route: Router
  ) {}

  async ngOnInit(): Promise<any> {
    this.ActivatedRoute.params.subscribe(params => {
      this.eid = params.id;
    });

    this.getEvent();

    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.userRoles = await this.keycloakService.getUserRoles();
    }
  }

  getEvent() {
    this.eventBookingService.getEventbyID(this.eid).subscribe(
      (response: any) => {
        // Booking detail fetching was good, bind it to component
        this.eventDetail = response;

        // else {
        //   // Something went wrong with getting the room
        //   this.paymentStatus =
        //     'Sorry, the booking you requested was not found. You may need to create a new booking.';
        //   console.error(
        //     'An error occurred while trying to fetch the room:\n',
        //     response
        //   );
        // }
      },
      error => {
        // Something went wrong when connecting to the API
        this.paymentStatus =
          'An error occurred on our end. Please try again later.';
        console.error(
          'An error occurred while trying to connecet to the API to get the room',
          error
        );
      }
    );
  }

  onSubmit(form) {
    const values = form.form.value;
    const data = {
      bookerEmail: values.email,
      bookerName: values.name,
      bookerPhone: values.mobile,
      eventEid: this.eid,
      userId: this.userProfile
    };
    this.eventBookingService.addNewBooking(data).subscribe(res => {
      if (res.success) {
        if (this.eventDetail.price === 0) {
          this.route.navigate(['/event/all']);
        } else {
          this.route.navigate(['/event/payment', res.booking.id]);
        }
      }
    });
  }

  onCancel() {}

  prettyDate(times): string {
    // console.log(dayjs(times));
    return (
      dayjs(times.start).format('D MMMM (dddd) [from] ha [- ]') +
      dayjs(times.end).format('ha')
    );
    // return dayjs(isoDate, 'd MMMM y', 'en-AU');
  }
}
