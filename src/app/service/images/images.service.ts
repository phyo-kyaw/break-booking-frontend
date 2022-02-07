import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
}

type DeleteResponse = Omit<UploadResponse, 'data'>;

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  _url = env.images;

  constructor(private _http: HttpClient) {}

  /**
   * Uploads images to S3
   *
   * @param value - {file: array}
   * @return Observerable Object
   */
  uploadImages(files: File[]) {
    let formDataList: Observable<UploadResponse>[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formDataList.push(
        this._http.post<UploadResponse>(`${this._url}/uploadImage`, formData)
      );
    }

    return forkJoin(formDataList).pipe(
      map(values =>
        values.map(value => ({
          success: value.success,
          imageSrc: value.data.url
        }))
      ),

      catchError(err => {
        console.error(
          'An error occurred while connecting to the API for uploading images',
          err
        );
        return of([{ success: false }]);
      })
    );
  }

  /**
   * Delete images from S3
   *
   * @param value - {url: array}
   * @return Observerable Object
   */
  deleteImages(urls: string[]) {
    let deleteList: Observable<DeleteResponse>[] = [];
    for (const url of urls) {
      deleteList.push(
        this._http.delete<DeleteResponse>(`${this._url}/deleteImage?url=${url}`)
      );
    }

    return forkJoin(deleteList).pipe(
      map(values =>
        values.map(value => ({
          success: value.success
        }))
      ),

      catchError(err => {
        console.error(
          'An error occurred while connecting to the API for deleting images',
          err
        );
        return of([{ success: false }]);
      })
    );
  }
}
