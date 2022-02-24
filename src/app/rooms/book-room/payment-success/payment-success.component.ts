import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomBookingService } from 'app/service/room-booking/room-booking.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  bookingDetails = null;
  bookingStatus = '';
  isLoading = true;
  loadingText = 'Payment successful. Redirecting...';

  constructor(
    private route: ActivatedRoute,
    private _bookingService: RoomBookingService
  ) {}

  ngOnInit(): void {
    this.getBookingDetails();
  }

  getBookingDetails() {
    this.route.params.subscribe(params => {
      this._bookingService.getBookingDetails(params.bookingId).subscribe(
        (response: any) => {
          if (response.success) {
            // Booking detail fetching was good, bind it to component
            this.bookingDetails = response.data;
            console.log(response.data);
          } else {
            // Something went wrong with getting the room
            this.bookingStatus =
              'Sorry, the booking you requested was not found. You may need to create a new booking.';
            console.error(
              'An error occurred while trying to fetch the booking details:\n',
              response
            );
          }
        },
        error => {
          // Something went wrong when connecting to the API
          this.bookingStatus =
            'An error occurred on our end. Please try again later.';
          console.error(
            'An error occurred while trying to connecet to the API to get the room',
            error
          );
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  formatDate(times: any) {
    return (
      dayjs(times.start).format('D MMMM (dddd) [from] ha [- ]') +
      dayjs(times.end).format('ha')
    );
  }

  pluralHours(hours: number) {
    if (hours > 1) return 's';
  }
}
