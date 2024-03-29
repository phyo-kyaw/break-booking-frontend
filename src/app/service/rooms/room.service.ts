import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  _url = env.roomsApi;

  constructor(private _http: HttpClient) {}

  getAllRooms(pageSize?: number) {
    // Set default page size
    if (typeof pageSize === 'undefined') {
      pageSize = 50;
    }

    return this._http.get(`${this._url}/?size=${pageSize}`);
  }

  /**
   * Creates a new room
   *
   * @param formData - a JSON that is stringified - all form fields are submitted
   */
  addRoom(formData: string) {
    return this._http.post(`${this._url}/add`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    });
  }

  /**
   * Retrieve a single room.
   *
   * @param id - room ID
   */
  getRoomById(id: string) {
    return this._http.get(`${this._url}/byId/${id}`);
  }

  /**
   * Update a room
   *
   * @param formData - a JSON that is stringified - all form fields are submitted
   */
  updateRoom(formData: string) {
    return this._http.put(`${this._url}/update`, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*'
      },
      body: formData
    });
  }

  /**
   * Delete a room by ID
   *
   * @param id - room ID
   */
  deleteRoom(id: string) {
    return this._http.delete(`${this._url}/delete/${id}`);
  }

  getRoomWithBookedTime(id: string) {
    return this._http.get(`${this._url}/withBookedTime/${id}`);
  }
}
