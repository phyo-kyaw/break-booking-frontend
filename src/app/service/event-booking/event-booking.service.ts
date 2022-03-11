import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Event } from '../../events/Types/event';
import { add } from 'date-fns';

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

  deleteAll() {
    return this._http.delete(`${this.addr}events/deleteDb`, {
      observe: 'events',
      responseType: 'text'
    });
  }

  // addNewEvent(
  //   title: string,
  //   price: number,
  //   startTime: string,
  //   endTime: string,
  //   city: string,
  //   postCode: string,
  //   street: string,
  //   description: string
  // ) {
  //   console.log('sss', startTime);
  //   const postData: Event = {
  //     description: description,
  //     endTime: endTime,
  //     location: {
  //       city: city,
  //       postCode: postCode,
  //       street: street
  //     },
  //     price: price,
  //     startTime: startTime,
  //     title: title
  //   };
  //   return this.http.post(`${this.addr}events/new`, postData);
  // }

  addNewEvent(props: any) {
    console.log('add event', props);
    const postData: Event = {
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
    return this._http.post(`${this.addr}events/new`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: postData
    });
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
    // bookerEmail:string,bookerName:string,bookerPhone:string,
    city: string,
    postCode: string,
    street: string,
    description: string
  ) {
    const postData: Event = {
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
      location: {
        city: city,
        postCode: postCode,
        street: street
      },
      price: price,
      startTime: startTime,
      title: title
    };
    console.log('aaaModify:', postData);
    return this._http.put(`${this.addr}events/update/${eid}`, postData);
  }
}
