import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../model/dictionary';
import { NgForm } from '@angular/forms';
import { DictionaryService } from '../services/value.service';

@Component({
  selector: 'app-view-dictionary',
  templateUrl: './view-dictionary.component.html',
  styleUrls: ['./view-dictionary.component.css']
})
export class ViewDictionaryComponent implements OnInit {
  dictionary: Dictionary | null = null;
  apiResponse = '';

  constructor(
    private route: ActivatedRoute,
    private _dictionaryService: DictionaryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fetchDict(params.id);
    });
  }

  /**
   * Get dictionary from API
   *
   * @param {string} id - dicitonary id
   */
  fetchDict(id: string): void {
    this._dictionaryService.getValues(id).subscribe(
      (response: any) => {
        if (response.success) {
          this.dictionary = response.data;
        } else {
          console.error(
            'Error occurred while retrieving dicitonary:\n',
            response
          );
        }
      },
      error =>
        console.error('Error occurred while getting dictionary,\n', error)
    );
  }

  addValue(f: NgForm): void {
    this._dictionaryService.addValue(f.form.value).subscribe(
      (response: any) => {
        if (response.success) {
          f.controls['value'].reset();
          this.apiResponse = '';
          this.fetchDict(this.dictionary.id);
        } else {
          this.apiResponse = response.message;
          console.log('error while submitting value\n', response);
        }
      },
      error =>
        console.error(
          'error while attempting to connect to dictionary api',
          error
        )
    );
  }

  /**
   * Removes a single value from the dictionary collection by ID.
   * If the API returns a success code, the node is hidden from the DOM.
   *
   * @param {string} id - ID of the dictionary collection
   * @param {string} value - value in the dictionary to remove
   */
  removeSingleValue(f: NgForm, wrap): void {
    this._dictionaryService.removeValue(f.form.value).subscribe(
      (response: any) => {
        if (response.success) {
          // Hide the deleted row from the DOM
          wrap.classList.add('d-none');
        } else {
          console.log('Error: while deleting value', response);
        }
      },
      error =>
        console.error(
          'error while attempting to connect to dictionary api',
          error
        )
    );
  }
}
