import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  _url = env.images;

  constructor(private _http: HttpClient) {}

  /**
   * Adds a single value to a single dictionary entry
   *
   * @param value - {id: string, value: string}
   */
  uploadImages(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this._http.post(this._url, formData);
  }
}
