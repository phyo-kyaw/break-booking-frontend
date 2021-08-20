import { Component, OnInit } from '@angular/core';
import { environment as env } from 'environments/environment';
import { DictionaryService } from '../../service/dictionaries/dictionary.service';
@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css']
})
export class DictionaryListComponent implements OnInit {
  dicts = [];
  apiStatus = 'Loading...';
  constructor(private _dictionaryService: DictionaryService) {}

  /**
   * Loads dictionaries from API
   */
  ngOnInit(): void {
    this._dictionaryService.getAllDictionaries().subscribe(
      (response: any) => {
        if (response.success) {
          this.dicts = response.data.content;
        } else {
          // Server responded, but with an error
          this.apiStatus =
            'An error occured while trying to get dictionaries. Please try again later';
          console.error(
            'Error occurred while fetching dictionaries\n',
            response
          );
        }
      },
      error => {
        this.apiStatus =
          'An error occured while trying to connect to the dicitonary API.';
        console.error(
          'An error occured while trying to connect to the dicitonary API.',
          error
        );
      }
    );
  }
}
