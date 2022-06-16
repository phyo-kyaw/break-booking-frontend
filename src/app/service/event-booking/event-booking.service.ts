import { Injectable } from '@angular/core';
<<<<<<< HEAD
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { environment as env } from 'environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

=======
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
>>>>>>> b733908adb70f5b2a16bddfa0c2d3bdbafe8f2f9
import { Event } from '../../events/Types/event';

type NewEventProps = Record<keyof Event | 'city' | 'postCode' | 'street', any>;
@Injectable({
  providedIn: 'root'
})
export class EventBookingService {
<<<<<<< HEAD

  _homeUrl = env.homeUrl;

  error = new Subject<string>();

  addr = this._homeUrl + 'api/v1/';
  constructor(private http: HttpClient) {}

  getAllevents(){
    return this.http
      .get(
        `${this.addr}events/list`,
      )
      .pipe(
        map(responseData => {
            console.log('getall',responseData)
            const postsArray: Event[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
        }),
      );
=======
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
>>>>>>> b733908adb70f5b2a16bddfa0c2d3bdbafe8f2f9
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
<<<<<<< HEAD
  addNewEvent(title: string, price: number,startTime:string,endTime:string,
    // bookerEmail:string,bookerName:string,bookerPhone:string,
    city:string,postCode:string,street:string,
    description:string) {
    console.log('sss',startTime)
    const postData: Event =
    {
      // booking: {
      //   bookerEmail: bookerEmail,
      //   bookerName: bookerName,
      //   bookerPhone: bookerPhone,
      //   // eventEid: string,
      //   id: '2',
      //   // userId: string
      // },
      description: description,
      endTime: endTime,
      // endTime:"2021-09-21T16:24:30",
=======

  addNewEvent(props: NewEventProps) {
    const data: Event = {
      description: props.description,
      endTime: new Date(props.endTime).toISOString(),
>>>>>>> b733908adb70f5b2a16bddfa0c2d3bdbafe8f2f9
      location: {
        city: props.city,
        postCode: props.postCode,
        street: props.street
      },
      price: 12,
      startTime: new Date(props.startTime).toISOString(),
      title: props.title
    };
    return this._http.post(`${this.addr}events/new`, data);
  }

  deleteEvent(eid: string) {
    return this._http.delete(`${this.addr}events/delete/${eid}`);
  }

<<<<<<< HEAD
  modifyEvent(eid:string,title: string, price: number,startTime:string,endTime:string,
    // bookerEmail:string,bookerName:string,bookerPhone:string,
    city:string,postCode:string,street:string,
    description:string){
    const postData: Event =
    {
      // booking: {
      //   bookerEmail: bookerEmail,
      //   bookerName: bookerName,
      //   bookerPhone: bookerPhone,
      //   // eventEid: string,
      //   id: '2',
      //   // userId: string
      // },
=======
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
>>>>>>> b733908adb70f5b2a16bddfa0c2d3bdbafe8f2f9
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
      event: {
        eid: string;
      };
      message: string;
      paidAmount: 0;
    }>(`${this.addr}bookings/new`, data);
  }

  getAllBookings() {
    return this._http.get(`${this.addr}bookings/list`);
  }

  getBookingByID(id) {
    return this._http.get<{
      bookerEmail: string;
      bookerName: string;
      bookerPhone: string;
      eventEid: string;
      id: string;
      userId: string;
    }>(`${this.addr}bookings/find/${id}`);
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
