import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ApptBookingData } from '../../appt-booking/event-data';
import { TimeM, DurationM, Break, ApptBookingEntity } from '../../appt-booking-entity/models'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApptBookingEntityDataService {

  apptBookingEntity: ApptBookingEntity;

  constructor(
    private http: HttpClient,
    //@Inject('BACKEND_API_URL') private homeUrl: string
  ) { }

  retrieveAllBookingEntities() {
    console.log("dataService");
    console.log(this.http.get<any>(`${environment.homeUrl}/api/bookingEntities`).subscribe());
    // this.http.get<any>(`http://localhost:8080/bookings`).subscribe(
    //   response => { console.log(response); },
    //   error => { console.log(error);
    // });
    return this.http.get<any>(`${environment.homeUrl}/api/bookingEntities`);
    //console.log("Execute Hello World Bean Service.")
  }

  getBookingEntity(gid){
    return this.http.get(`${environment.homeUrl}/api/bookingEntities/${gid}`);
  }

  createBookingEntity(apptBookingEntity){
    return this.http.post(`${environment.homeUrl}/api/bookingEntities`, apptBookingEntity);
  }

  updateBookingEntity(gid, apptBookingEntity){
    return this.http.put(`${environment.homeUrl}/api/bookingEntities/${gid}`, apptBookingEntity);
  }

  deleteBookingEntity(gid){
    return this.http.delete(`${environment.homeUrl}/api/bookingEntities/${gid}`);
  }



}

