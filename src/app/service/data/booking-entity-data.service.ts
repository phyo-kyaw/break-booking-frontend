import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { EventData } from '../../calendar-sel/event-data';
import { TimeM, DurationM, Break, _BookingEntity } from '../../booking-entity/models'

@Injectable({
  providedIn: 'root'
})
  
export class BookingEntityDataService {

  bookingEntity: _BookingEntity;

  constructor(
    private http: HttpClient,
    @Inject('BACKEND_API_URL') private apiUrl: string
  ) { }

  retrieveAllBookingEntities() {
    console.log("dataService");
    console.log(this.http.get<any>(`http://${this.apiUrl}/bookingEntities`).subscribe());
    // this.http.get<any>(`http://localhost:8080/bookings`).subscribe(
    //   response => { console.log(response); },
    //   error => { console.log(error);
    // });
    return this.http.get<any>(`http://${this.apiUrl}/bookingEntities`);
    //console.log("Execute Hello World Bean Service.")
  }

  getBookingEntity(gid){
    return this.http.get(`http://${this.apiUrl}/bookingEntities/${gid}`);
  }

  createBookingEntity(bookingEntity){
    return this.http.post(`http://${this.apiUrl}/bookingEntities`, bookingEntity);
  }

  deleteBookingEntity(id){
    return this.http.delete(`http://${this.apiUrl}/bookingEntities/${id}`);
  }

  

}

