import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Event } from '../../events/Types/event';

type NewEventProps = Record<keyof Event | 'city' | 'postCode' | 'street', any>;
@Injectable({
  providedIn: 'root'
})
export class EventBookingService {
  error = new Subject<string>();

  addr = 'http://localhost:8087/api/v1/';

  constructor(private _http: HttpClient) {}

  getAllevents() {
    return this._http.get(`${this.addr}events/list`).pipe(
      map(responseData => {
        console.log('getall', responseData);
        const postsArray: Event[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      })
    );
  }

  getEventbyID(id: string) {
    return this._http.get(`${this.addr}events/find/${id}`);
  }

  deleteAll() {
    return this._http.delete(`${this.addr}events/deleteDb`, {
      observe: 'events',
      responseType: 'text'
    });
  }

  addNewEvent(props: NewEventProps) {
    const data: Event = {
      description: props.description,
      endTime: props.endTime,
      location: {
        city: props.city,
        postCode: props.postCode,
        street: props.street
      },
      price: 12,
      startTime: props.startTime,
      title: props.title
    };
    return this._http.post(`${this.addr}events/new`, data);
  }

  deleteEvent(eid: string) {
    return this._http.delete(`${this.addr}events/delete/${eid}`, {
      observe: 'events',
      responseType: 'text'
    });
  }

  modifyEvent(
    eid: string,
    title: string,
    price: number,
    startTime: string,
    endTime: string,
    city: string,
    postCode: string,
    street: string,
    description: string
  ) {
    const postData: Event = {
      description: description,
      endTime: endTime,
      location: {
        city: city,
        postCode: postCode,
        street: street
      },
      price: price,
      startTime: startTime,
      title: title
    };

    return this._http.put(`${this.addr}events/update/${eid}`, postData);
  }

  addNewBooking(data) {
    return this._http.post<{
      success: boolean;
      booking: {
        id: string;
        bookerEmail: string;
        bookerName: string;
        bookerPhone: string;
        userId: string;
      };
      message: string;
      paidAmount: 0;
    }>(`${this.addr}bookings/new`, data);
  }

  getAllBookings() {
    return this._http.get(`${this.addr}bookings/list`);
  }

  getBookingByID(id) {
    return this._http.get(`${this.addr}bookings/find/${id}`);
  }

  getBookingByEvent(eid) {
    return this._http.get(`${this.addr}bookings/event/${eid}`);
  }

  deleteBooking(id: string) {
    return this._http.delete(`${this.addr}bookings/delete/${id}`);
  }

  deleteAllBookings() {
    return this._http.delete(`${this.addr}bookings/deleteDb`);
  }

  getToken() {
    return this._http.get(`${this.addr}/getToken`);
  }
  pay(eid: string, amount: number, type: number, nonce: string) {
    const params = new HttpParams()
      .set('eid', eid)
      .set('amount', amount.toString())
      .set('type', type.toString());

    return this._http.get(`${this.addr}/pay/${nonce}`, {
      params: params
    });
  }
}
