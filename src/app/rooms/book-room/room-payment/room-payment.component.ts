import { Component, OnInit } from '@angular/core';
import { create as createDropUI } from 'braintree-web-drop-in';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomBookingService } from 'app/service/room-booking/room-booking.service';
import { RoomPaymentService } from 'app/service/room-payment/room-payment.service';

@Component({
  selector: 'app-room-payment',
  templateUrl: './room-payment.component.html',
  styleUrls: ['./room-payment.component.css']
})
export class RoomPaymentComponent implements OnInit {
  roomStatus: string = 'Getting payment information...';
  isLoading = true;
  loadingScreenText = 'Getting payment information...';
  bookingDetails = null;
  /**
   * token from our server
   */
  token: string;
  dropUiInstance = null;
  dropUiCreateError = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _bookingService: RoomBookingService,
    private _paymentService: RoomPaymentService
  ) {}

  ngOnInit(): void {
    this.getBookingDetails();
    this.getTokenAndInitDropUI();
  }

  getBookingDetails() {
    this.route.params.subscribe(params => {
      this._bookingService.getBookingDetails(params.id).subscribe(
        (response: any) => {
          if (response.success) {
            // Booking detail fetching was good, bind it to component
            this.bookingDetails = response.data;
          } else {
            // Something went wrong with getting the room
            this.roomStatus =
              'Sorry, the booking you requested was not found. You may need to create a new booking.';
            console.error(
              'An error occurred while trying to fetch the room:\n',
              response
            );
          }
        },
        error => {
          // Something went wrong when connecting to the API
          this.roomStatus =
            'An error occurred on our end. Please try again later.';
          console.error(
            'An error occurred while trying to connecet to the API to get the room',
            error
          );
        }
      );
    });
  }

  getTokenAndInitDropUI() {
    this._paymentService.getToken().subscribe(
      (response: any) => {
        if (response.success) {
          // Getting token was good, bind it to component
          this.token = response.data.token;

          // Init DropUI
          createDropUI(
            {
              authorization: response.data.token,
              container: document.getElementById('dropin-container')
            },
            (createErr, instance) => {
              if (createErr) {
                console.error('Error occurred while initializing Drop UI');
                return;
              }

              this.dropUiCreateError = createErr;
              this.dropUiInstance = instance;
            }
          );
        } else {
          // Something went wrong with getting the room
          this.roomStatus =
            'Sorry, an error occurred on our end. Please try again later.';
          console.error(
            'An error occurred while trying to get the payment token:\n',
            response
          );
        }
      },
      error => {
        // Something went wrong when connecting to the API
        console.error(
          'An error occurred while trying to connect to the API for the payment token:\n',
          error
        );
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  formatPrice(value: number) {
    // Convert price to array of numbers
    const priceArr = value.toString().split('');

    // Add a `.` from the second spot from the end
    priceArr.splice(-2, 0, '.');

    return '$' + priceArr.join('');
  }

  onSubmit() {
    this.dropUiInstance.requestPaymentMethod(
      (requestPaymentMethodErr, payload) => {
        if (requestPaymentMethodErr) {
          console.error(
            'An error occurred with payment methods\n',
            requestPaymentMethodErr
          );
          return;
        }

        this.isLoading = true;
        this.loadingScreenText = 'Processing payment...';

        // Submit payload.nonce to your server
        this._paymentService
          .pay(
            this.bookingDetails.id,
            this.bookingDetails.totalAmount,
            1,
            payload.nonce
          )
          .subscribe(
            (response: any) => {
              console.log(response);
              if (response.success) {
                this.loadingScreenText = 'Payment successful. Redirecting...';

                setTimeout(() => {
                  this.router.navigateByUrl(
                    `/rooms/payment/success/${this.bookingDetails.id}`
                  );
                }, 1500);
              } else {
                // Something went wrong with getting the room
                this.roomStatus =
                  'Sorry, an error occurred on our end. Please try again later.';
                console.error(
                  'An error occurred while trying to get the payment token:\n',
                  response
                );
              }
            },
            error => {
              // Something went wrong when connecting to the API
              console.error(
                'An error occurred while trying to connect to the payment API:\n',
                error
              );
            }
          );
      }
    );
  }
}
