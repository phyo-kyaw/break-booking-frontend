import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  _url = env.dictApi;

  constructor(private _http: HttpClient) {}

  /**
   * Returns all dictionary entries
   */
  getAllDictionaries() {
    return this._http.get(env.dictApi);
  }

  /**
   * Returns all values from a single dictionary entry
   *
   * @param id - ID of a dictionary key
   */
  getValues(id: string) {
    return this._http.get(`${env.dictApi}/byId/${id}`);
  }

  /**
   * Adds a single value to a single dictionary entry
   *
   * @param value - {id: string, value: string}
   */
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

  /**
   * Removes a single value from a single dictionary entry
   *
   * @param value - {id: string, value: string}
   */
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
