import { Component, OnInit } from '@angular/core';
import { EventBookingService } from 'app/service/event-booking/event-booking.service';
import { create } from 'braintree-web-drop-in';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentStatus: string = 'Getting payment information...';
  dropUiInstance = null;
  dropUiCreateError = null;
  token: string;
  error = '';
  isError = false;
  isLoading = true;
  loadingScreenText = 'Getting payment information...';
  eid: string;

  constructor(private eventBookingService: EventBookingService) {}

  ngOnInit(): void {}

  getToken() {
    this.eventBookingService.getToken().subscribe(
      (response: any) => {
        if (response.success) {
          // Getting token was good, bind it to component
          this.token = response.data.token;

          // Init DropUI
          create(
            {
              authorization: response.data.token,
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
          this.error = response.message
            ? response.message
            : 'An error occurred while processing your payment.';
          this.paymentStatus =
            'Sorry, an error occurred on our end. Please try again later.';
          console.error(
            'An error occurred while trying to get the payment token:\n',
            response
          );
          // setTimeout(() => {
          //   this.viewportScroller.scrollToAnchor('alert');
          // }, 0);
        }
      },
      error => {
        // Something went wrong when connecting to the API
        console.error(
          'An error occurred while trying to connect to the API for the payment token:\n',
          error
        );
        this.isError = true;
        this.error = error.message
          ? error.message
          : 'An error occurred while processing your payment.';
        // setTimeout(() => {
        //   this.viewportScroller.scrollToAnchor('alert');
        // }, 0);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSubmit(form) {
    this.dropUiInstance.requestPaymentMethod(
      (requestPaymentMethodErr, payload) => {
        if (requestPaymentMethodErr) {
          console.error(
            'An error occurred with payment methods\n',
            requestPaymentMethodErr
          );
          this.isError = true;
          this.error = 'An error occurred while processing your payment.';
          // setTimeout(() => {
          //   this.viewportScroller.scrollToAnchor('alert');
          // }, 0);
          return;
        }

        this.isLoading = true;
        this.loadingScreenText = 'Processing payment...';

        // Submit payload.nonce to your server
        // this.eventBookingService
        //   .pay(this.eid, this.eventDetail.price, 1, payload.nonce)
        //   .subscribe(
        //     (response: any) => {
        //       console.log(response);
        //       if (response.success) {
        //         this.loadingScreenText = 'Payment successful. Redirecting...';
        //         // navigate to success page
        //         // setTimeout(() => {
        //         //   this.route.navigateByUrl(
        //         //     `/event/payment/success/${this.eid}`
        //         //   );
        //         // }, 1500);
        //       } else {
        //         // Something went wrong with getting the paymen info
        //         this.isError = true;
        //         this.error =
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
        //         'An error occurred while trying to connect to the payment API:\n',
        //         error
        //       );
        //     }
        //   );
      }
    );
  }
}
