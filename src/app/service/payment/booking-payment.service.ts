
import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingPaymentService {
  _url = env.bookingPayment;

  constructor(private _http: HttpClient) {}

  getToken() {
    return this._http.get(`${this._url}/getToken`);
  }

  /**
   *
   * @param {string} bookingId
   * @param {number} amount
   * @param {number} type - 1 = room booking; 2 = event booking
   * @param {string} nonce
   */
  pay(bookingId: string, amount: number, type: number, nonce: string) {
    const params = new HttpParams()
      .set('bookingId', bookingId)
      .set('amount', amount.toString())
      .set('type', type.toString());

    return this._http.get(`${this._url}/pay/${nonce}`, {
      params: params
    });
  }
}

