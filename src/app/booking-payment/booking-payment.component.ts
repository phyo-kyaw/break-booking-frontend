
import { Component, OnInit } from '@angular/core';
import { create as createDropUI } from 'braintree-web-drop-in';
import { ActivatedRoute, Router } from '@angular/router';
//import { RoomBookingService } from 'app/service/room-booking/room-booking.service';
//import { RoomPaymentService } from 'app/service/room-payment/room-payment.service';
import { ViewportScroller } from '@angular/common';
import { ApptBookingDataService } from 'app/service/data/appt-booking-data.service';
import { BookingPaymentService } from 'app/service/payment/booking-payment.service';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.css']
})
export class BookingPaymentComponent implements OnInit {
  paymentStatus: string = 'Getting payment information...';
  isLoading = true;
  loadingScreenText = 'Getting payment information...';
  bookingDetails = null;
  /**
   * token from our server
   */
  token: string;
  dropUiInstance = null;
  dropUiCreateError = null;
  error = '';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _bookingService: ApptBookingDataService,
    private _paymentService: BookingPaymentService,
    private viewportScroller: ViewportScroller
  ) {
    this.viewportScroller.setOffset([0, 70]);
  }

  ngOnInit(): void {
    this.getBookingDetails();
    this.getTokenAndInitDropUI();
  }

  getBookingDetails() {
    this.route.params.subscribe(params => {
      this._bookingService.getBookingsByGid(params.id).subscribe(
        (response: any) => {
          if (response != null) {
            // Booking detail fetching was good, bind it to component
            this.bookingDetails = response;
          } else {
            // Something went wrong with getting the room
            this.paymentStatus =
              'Sorry, the booking you requested was not found. You may need to create a new booking.';
            console.error(
              'An error occurred while trying to fetch the room:\n',
              response
            );
          }
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
    });
  }

  getTokenAndInitDropUI() {
    this._paymentService.getToken().subscribe(
      (response: any) => {
        if (response.token != null ) {
          // Getting token was good, bind it to component
          this.token = response.token;

          // Init DropUI
          createDropUI(
            {
              authorization: response.token,
              container: document.getElementById('dropin-container')
            },
            (createErr, instance) => {
              if (createErr) {
                console.error('Error occurred while initializing Drop UI');
                this.isError = true;
                this.error =
                  'An error occurred while processing the payment form.';

                return;
              }

              this.dropUiCreateError = createErr;
              this.dropUiInstance = instance;
            }
          );
        } else {
          // Something is wrong with the payment details

          this.isError = true;
          // this.error = response.message
          //   ? response.message
          //   :
          this.error =  'An error occurred while processing your payment.';
          this.paymentStatus =
            'Sorry, an error occurred on our end. Please try again later.';
          console.error(
            'An error occurred while trying to get the payment token:\n',
            response
          );
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor('alert');
          }, 0);
        }
      },
      error => {
        // Something went wrong when connecting to the API
        console.error(
          'An error occurred while trying to connect to the API for the payment token:\n',
          error
        );
        this.isError = true;
        // this.error = error.message
        //   ? error.message
        //   :
        this.error =  'An error occurred while processing your payment.';
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor('alert');
        }, 0);
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
          this.isError = true;
          this.error = 'An error occurred while processing your payment.';
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor('alert');
          }, 0);
          return;
        }

        this.isLoading = true;
        this.loadingScreenText = 'Processing payment...';

        // Submit payload.nonce to your server
        this._paymentService
          .pay(
            this.bookingDetails.bookingEntityGid,
            2500, //this.bookingDetails.totalAmount,
            2,
            payload.nonce
          )
          .subscribe(
            (response: any) => {
              console.log(response);
              if (response != null) {
                this.loadingScreenText = 'Payment successful. Redirecting. Thank you... =)';

                setTimeout(() => {
                  this.router.navigateByUrl(
                    `/list`
                  );
                }, 1500);


              } else {
                // Something went wrong with getting the paymen info
                this.isError = true;
                this.error =
                  'Sorry, an error occurred on our end. Please try again later.';
                console.error(
                  'An error occurred while trying to get the payment token:\n',
                  response
                );
                setTimeout(() => {
                  this.viewportScroller.scrollToAnchor('alert');
                }, 0);
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

