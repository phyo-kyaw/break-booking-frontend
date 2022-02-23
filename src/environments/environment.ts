// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseApiUrl = 'http://15.206.126.5';
export const environment = {
 // production: false,
  production: false,
  //homeUrl: '${HOME_URL}',
  homeUrl: 'http://localhost:8080',
  roomsApi: `${baseApiUrl}:8081/api/v1/app/rooms`,
  dictApi: `${baseApiUrl}:8086/api/v1/dicts`, // dictionaries
  roomBooking: `${baseApiUrl}:8081/api/v1/app/bookings`, // room booking controller
  roomPayment: `${baseApiUrl}:8084/api/v1/payment`,
  bookingPayment: `http://120.159.30.85:8084/api/v1/payment`,
  images: 'http://booking.nobrainer.link:8087/api/v1/file/uploadImage' // direct link because its not exposed on the gateway
  //backendhomeUrl: 'break-booking.online/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
