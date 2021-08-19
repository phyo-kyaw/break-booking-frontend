import { Component, OnInit } from '@angular/core';
import { environment as env } from 'environments/environment';
@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css']
})
export class DictionaryListComponent implements OnInit {
  dicts = [];
  apiStatus = 'Loading';
  constructor() {}

  /**
   * Loads dictionaries from API
   */
  async ngOnInit(): Promise<void> {
    const response = await fetch(`${env.dictApi}`);
    const result = await response.json();

    if (result.success) {
      this.dicts = result.data.content;
    } else {
      this.apiStatus =
        'An error occured while trying to get dictionaries. Please try again later';
      console.error('Error occurred while fetching dictionaries\n', result);
    }
  }
}
