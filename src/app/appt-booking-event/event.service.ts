import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Event } from './event.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  error = new Subject<string>();

  addr='http://localhost:8080/api/v1/'
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
  }
  deleteAll(){
    return this.http
    .delete(`${this.addr}events/deleteDb`, {
      observe: 'events',
      responseType: 'text'
    })
  }
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
      // endTime: endTime,
      endTime:"2021-09-11T16:24:30",
      location: {
        city: city,
        postCode:postCode,
        street: street
      },
      price: price,
      // startTime:startTime,
      startTime:"2021-09-11T16:24:30",
      title: title
    }
    return this.http
      .post(
        `${this.addr}events/new`,
        postData
      )
  }

  deleteEvent(eid:string) {
    return this.http
      .delete(`${this.addr}events/delete/${eid}`, {
        observe: 'events',
        responseType: 'text'
      })
  }

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
      description: description,
      endTime: endTime,
      location: {
        city: city,
        postCode:postCode,
        street: street
      },
      price: price,
      startTime:startTime,
      title: title
    }
    console.log('aaaModify:',postData)
    return this.http
    .put(`${this.addr}events/update/${eid}`,
      postData
      )
    }
}
