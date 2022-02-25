import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ApptBookingData } from '../../service-booking/appt-booking/event-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApptBookingDataService {

  constructor(
    private http: HttpClient,
    //@Inject('BACKEND_API_URL') private homeUrl: string
  ) { }

  getAllBookings() {
    //console.log("dataService");
    //console.log(this.http.get<any>(`https://${environment.homeUrl}/api/bookings`).subscribe());
    // this.http.get<any>(`http://localhost:8080/bookings`).subscribe(
    //   response => { console.log(response); },
    //   error => { console.log(error);
    // });
    return this.http.get<any>(`${environment.homeUrl}/api/bookings`);
    //console.log("Execute Hello World Bean Service.")
  }

  getBookingsByGid(gid) {
    console.log(gid)
    return this.http.get<any>(`${environment.homeUrl}/api/bookings/gid/${gid}`);
    //console.log("Execute Hello World Bean Service.")
  }

  createBooking(apptBooking){
    return this.http.post(`${environment.homeUrl}/api/bookings`, apptBooking);
  }

  deleteBooking(id){
    return this.http.delete(`${environment.homeUrl}/api/bookings/${id}`);
  }

}
