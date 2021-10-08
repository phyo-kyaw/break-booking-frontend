import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomBookingService {
  _url = env.roomBooking;

  constructor(private _http: HttpClient) {}

  getBookingDetails(id: string) {
    return this._http.get(`${this._url}/byId/${id}`);
  }
}
