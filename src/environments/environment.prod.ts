

const baseApiUrl = 'http://15.206.126.5';
export const environment = {
 // production: false,
  production: true,
  homeUrl: '${HOME_URL}',
  bookingPayment: '${HOME_URL}/api/paymentBooking',
  //homeUrl: 'http://localhost:8080',
  // roomsApi: `${baseApiUrl}:8081/api/v1/app/rooms`,
  // dictApi: `${baseApiUrl}:8086/api/v1/dicts`, // dictionaries
  // roomBooking: `${baseApiUrl}:8081/api/v1/app/bookings`, // room booking controller
  // roomPayment: `${baseApiUrl}:8084/api/v1/payment`,
  roomsApi: `${baseApiUrl}/api/v1/app/rooms`,
  dictApi: `${baseApiUrl}/api/v1/dicts`, // dictionaries
  roomBooking: `${baseApiUrl}/api/v1/app/bookings`, // room booking controller
  roomPayment: `${baseApiUrl}/api/v1/payment`,

  images: 'http://booking.nobrainer.link:8087/api/v1/file/uploadImage' // direct link because its not exposed on the gateway
  //backendhomeUrl: 'break-booking.online/api'
};
