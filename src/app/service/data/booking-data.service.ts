import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { EventData } from '../../calendar-sel/event-data';

@Injectable({
  providedIn: 'root'
})
export class BookingDataService {

  constructor(
    private http: HttpClient,
    @Inject('BACKEND_API_URL') private apiUrl: string
  ) { }

  getAllBookings() {
    //console.log("dataService");
    //console.log(this.http.get<any>(`https://${this.apiUrl}/bookings`).subscribe());
    // this.http.get<any>(`http://localhost:8080/bookings`).subscribe(
    //   response => { console.log(response); },
    //   error => { console.log(error);
    // });
    return this.http.get<any>(`${this.apiUrl}/bookings`);
    //console.log("Execute Hello World Bean Service.")
  }

  getBookingsByGid(gid) {
    console.log(gid)
    return this.http.get<any>(`${this.apiUrl}/bookings/gid/${gid}`);
    //console.log("Execute Hello World Bean Service.")
  }

  createBooking(booking){
    return this.http.post(`${this.apiUrl}/bookings`, booking);
  }

  deleteBooking(id){
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }

}
