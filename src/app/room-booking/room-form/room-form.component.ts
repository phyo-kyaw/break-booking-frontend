import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'environments/environment';
import { Room } from '../model/room';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {
  @ViewChild('errorOccurredModal', { static: false })
  private errorOccurredModal;
  @Input() roomId: string = '';

  room: Room | null = null;
  roomFetchStatus: string = 'Getting room info...';
  fetchStatusForUser: string = 'Loading...';
  isLoading: boolean = false;

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.viewportScroller.setOffset([0, 70]);
  }

  /**
   * If there is an ID passed to the component, the form fetches the room with
   * the given ID and binds it to itself. Otherwise it creates an empty form.
   */
  ngOnInit(): void {
    // Is there an ID passed to the component?
    if (this.roomId.trim().length > 0) {
      this.fetchRoom();
    } else {
      // Create empty form with the room model
      this.room = new Room();
    }
  }

  /**
   *
   * Checks validity of all form inputs, and submits a PUT request to
   * update the given room, or creates a new room if there is no roomId
   *
   * @param {NgForm} f form instance
   */
  onSubmit(f: NgForm): void {
    // Check if all the fields are valid
    if (f.valid) {
      // Show loading screen
      this.isLoading = true;

      // Check if the form is an edit form
      if (this.roomId.trim().length) {
        this.editRoom(f);
      } else {
        this.addRoom(f);
      }
    } else {
      // Not all fields are valid, tell user to fix the inputs
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('alert');
      }, 0);
    }
  }

  /**
   * Retrieves the room and loads it in the form
   */
  async fetchRoom(): Promise<void> {
    // Get the room with the ID
    const response = await fetch(`${environment.roomsApi}/byId/${this.roomId}`);
    const result = await response.json();

    if (result.success) {
      // Room fetching was good, bind it to component
      this.room = result.data;
    } else {
      // Something went wrong with getting the room
      this.roomFetchStatus = 'Sorry, the selected room was not found.';
    }
  }

  async editRoom(f: NgForm): Promise<void> {
    const response = await fetch(`${environment.roomsApi}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(f.form.value)
    });

    const result = await response.json();

    if (result.success) {
      console.log('success on uupdate room');
      this.fetchStatusForUser = 'Room successfully updated. Redirecting...';
      setTimeout(() => {
        this.router.navigateByUrl('/room-booking');
      }, 2000);
    } else {
      this.notifyOfError(result, 'update');
    }
  }

  async addRoom(f: NgForm): Promise<void> {
    const response = await fetch(`${environment.roomsApi}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(f.form.value)
    });

    const result = await response.json();

    if (result.success) {
      // Notify user of the success
      this.fetchStatusForUser = 'Room created successfully. Redirecting...';
      // Redirect to the room booking home page
      setTimeout(() => {
        this.router.navigateByUrl('/room-booking');
      }, 1500);
    } else {
      // Notify user of the fail
      this.notifyOfError(result, 'create');
    }
  }

  /**
   * Opens a modal
   */
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'error-modal' });
  }

  /**
   * Hides loading screen, opens modal that shows what the error was, and logs the result object
   * to console.
   *
   * @param action - was the room supposed to be created or updated
   */
  notifyOfError(result: any, action: 'create' | 'update'): void {
    // Hide loading screen
    this.isLoading = false;
    // Update message for user to know whats happening
    this.fetchStatusForUser = `An error occurred while trying to ${action} the room.\nCode: ${result.code}\nMessage: ${result.message}`;

    console.error(
      `An error occurred while trying to ${action} the room:`,
      result
    );
    this.openModal(this.errorOccurredModal);
  }
}
