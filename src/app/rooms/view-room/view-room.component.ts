import { Component, OnInit } from '@angular/core';
import { environment as env } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../model/room';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.css']
})
export class ViewRoomComponent implements OnInit {
  room: Room | null = null;
  isError = false;
  errorText = '';
  isLoading = true;
  loadingText = 'Getting room info...';

  constructor(private route: ActivatedRoute) {}

  /**
   * Retrieve the ID from the route and get the room from API
   */
  ngOnInit() {
    // Get room ID
    this.route.params.subscribe(params => {
      this.fetchRoom(params.id);
    });
  }

  /**
   * Get room from API
   *
   * @param {string} id - room id
   */
  async fetchRoom(id: string): Promise<void> {
    const response = await fetch(`${env.roomsApi}/byId/${id}`);
    const result = await response.json();

    if (response.ok) {
      if (result.success) {
        this.room = result.data;
        console.log(result.data);
      } else {
        console.error(`Room with the id ${id} not found.\n`, result);
        this.isError = true;
        this.errorText =
          'The room you were looking for was not found. If you think this is a mistake, please contact us.';
      }
    } else {
      console.error('Error occurred while retrieving room:\n', result);
      this.isError = true;
      this.errorText = 'An error occurred on our end. Please try again later.';
    }

    this.isLoading = false;
  }

  /**
   * Checks if the passed variable is a number
   *
   * @param {any} num - variable to check if its a number
   *
   * @returns boolean
   */
  isNumber(num: any): boolean {
    return !Number.isNaN(num);
  }

  availTypeToWords(type: number) {
    switch (type) {
      case 0: {
        return 'Workday';
      }
      case 1: {
        return 'Weekend';
      }
    }
  }

  formatPrice(value: number) {
    // Convert price to array of numbers
    const priceArr = value.toString().split('');

    // Add a `.` from the second spot from the end
    priceArr.splice(-2, 0, '.');

    return '$' + priceArr.join('');
  }

  outputRoomTypeIcon(type: string) {
    switch (type) {
      case 'Party room': {
        return 'celebration';
      }
      case 'Meeting room': {
        return 'groups';
      }
      case 'Dinning room': {
        return 'restaurant';
      }
    }
  }
}
