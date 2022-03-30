import { Component, OnInit } from '@angular/core';
// import { create } from 'braintree-web-drop-in';
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
  token: string;
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
    // this.getEvent();
    // this.getToken();
    this.ActivatedRoute.params.subscribe(params => {
      this.eid = params.id;
    });

    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.userRoles = await this.keycloakService.getUserRoles();
    }
  }

  // getEvent() {
  //   this.eventBookingService.getEventbyID(this.eid).subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         // Booking detail fetching was good, bind it to component
  //         this.eventDetail = response.data;
  //       } else {
  //         // Something went wrong with getting the room
  //         this.paymentStatus =
  //           'Sorry, the booking you requested was not found. You may need to create a new booking.';
  //         console.error(
  //           'An error occurred while trying to fetch the room:\n',
  //           response
  //         );
  //       }
  //     },
  //     error => {
  //       // Something went wrong when connecting to the API
  //       this.paymentStatus =
  //         'An error occurred on our end. Please try again later.';
  //       console.error(
  //         'An error occurred while trying to connecet to the API to get the room',
  //         error
  //       );
  //     }
  //   );
  // }

  // getToken() {
  //   this.eventBookingService.getToken().subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         // Getting token was good, bind it to component
  //         this.token = response.data.token;

  //         // Init DropUI
  //         create(
  //           {
  //             authorization: response.data.token,
  //             container: document.getElementById('dropin-container')
  //           },
  //           (createErr, instance) => {
  //             if (createErr) {
  //               console.error('Error occurred while initializing Drop UI');
  //               this.isError = true;
  //               this.error =
  //                 'An error occurred while processing the payment form.';

  //               return;
  //             }

  //             this.dropUiCreateError = createErr;
  //             this.dropUiInstance = instance;
  //           }
  //         );
  //       } else {
  //         // Something is wrong with the payment details

  //         this.isError = true;
  //         this.error = response.message
  //           ? response.message
  //           : 'An error occurred while processing your payment.';
  //         this.paymentStatus =
  //           'Sorry, an error occurred on our end. Please try again later.';
  //         console.error(
  //           'An error occurred while trying to get the payment token:\n',
  //           response
  //         );
  //         // setTimeout(() => {
  //         //   this.viewportScroller.scrollToAnchor('alert');
  //         // }, 0);
  //       }
  //     },
  //     error => {
  //       // Something went wrong when connecting to the API
  //       console.error(
  //         'An error occurred while trying to connect to the API for the payment token:\n',
  //         error
  //       );
  //       this.isError = true;
  //       this.error = error.message
  //         ? error.message
  //         : 'An error occurred while processing your payment.';
  //       // setTimeout(() => {
  //       //   this.viewportScroller.scrollToAnchor('alert');
  //       // }, 0);
  //     },
  //     () => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // onSubmit(form) {
  //   this.dropUiInstance.requestPaymentMethod(
  //     (requestPaymentMethodErr, payload) => {
  //       if (requestPaymentMethodErr) {
  //         console.error(
  //           'An error occurred with payment methods\n',
  //           requestPaymentMethodErr
  //         );
  //         this.isError = true;
  //         this.error = 'An error occurred while processing your payment.';
  //         // setTimeout(() => {
  //         //   this.viewportScroller.scrollToAnchor('alert');
  //         // }, 0);
  //         return;
  //       }

  //       this.isLoading = true;
  //       this.loadingScreenText = 'Processing payment...';

  //       // Submit payload.nonce to your server
  //       this.eventBookingService
  //         .pay(this.eid, this.eventDetail.price, 1, payload.nonce)
  //         .subscribe(
  //           (response: any) => {
  //             console.log(response);
  //             if (response.success) {
  //               this.loadingScreenText = 'Payment successful. Redirecting...';
  //               // navigate to success page
  //               // setTimeout(() => {
  //               //   this.route.navigateByUrl(
  //               //     `/event/payment/success/${this.eid}`
  //               //   );
  //               // }, 1500);
  //             } else {
  //               // Something went wrong with getting the paymen info
  //               this.isError = true;
  //               this.error =
  //                 'Sorry, an error occurred on our end. Please try again later.';
  //               console.error(
  //                 'An error occurred while trying to get the payment token:\n',
  //                 response
  //               );
  //               // setTimeout(() => {
  //               //   this.viewportScroller.scrollToAnchor('alert');
  //               // }, 0);
  //             }
  //           },
  //           error => {
  //             // Something went wrong when connecting to the API
  //             console.error(
  //               'An error occurred while trying to connect to the payment API:\n',
  //               error
  //             );
  //           }
  //         );
  //     }
  //   );
  // }

  onSubmit(form) {
    // console.log(form.form.value);
    const values = form.form.value;
    const data = {
      bookerEmail: values.email,
      bookerName: values.name,
      bookerPhone: values.mobile,
      eventEid: this.eid,
      userId: this.userProfile
    };
    this.eventBookingService.addNewBooking(data).subscribe(res => {
      console.log(res);
      this.route.navigate(['/event/all']);
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
