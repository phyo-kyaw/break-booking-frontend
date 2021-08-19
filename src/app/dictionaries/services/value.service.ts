import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  _url = env.dictApi;

  constructor(private _http: HttpClient) {}

  getValues(id: string) {
    return this._http.get(`${env.dictApi}/byId/${id}`);
  }

  addValue(value: { id: string; value: string }) {
    return this._http.post(
      `${this._url}/addValue?id=${value.id}&value=${value.value}`,
      '',
      {
        headers: {
          Accept: '*/*'
        }
      }
    );
  }

  removeValue(value: { id: string; value: string }) {
    return this._http.delete(
      `${this._url}/deleteValue?id=${value.id}&value=${value.value}`,
      {
        headers: {
          Accept: '*/*'
        }
      }
    );
  }
}
