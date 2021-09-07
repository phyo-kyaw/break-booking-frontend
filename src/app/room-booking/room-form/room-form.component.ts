import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Room } from '../model/room';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomService } from 'app/service/rooms/room.service';
import { DictionaryService } from 'app/service/dictionaries/dictionary.service';

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
  gettingRoomInfo: string = 'Getting room info...';
  fetchStatusForUser: string = 'Loading...';
  isLoading: boolean = false;
  allCities: string[] = [];
  /**
   * All possible facilities from API
   */
  facilities: string[] = [];
  facilityStatus = 'Getting facilities...';
  showFacilitiesLink = false;
  /**
   * Facilities that the room has
   */
  roomFacilities: { value: string; checked: boolean }[] = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private modalService: NgbModal,
    private _roomService: RoomService,
    private _dictionaryService: DictionaryService
  ) {
    this.viewportScroller.setOffset([0, 70]);
  }

  /**
   * If there is an ID passed to the component, the form fetches the room with
   * the given ID and binds it to itself. Otherwise it creates an empty form.
   */
  async ngOnInit(): Promise<void> {
    // // Get all possible facilities from API
    // // this.fetchFacilities();
    const promiseResolved = await this.fetchFacilities();

    if (await promiseResolved) {
      this.createFacilityCheckboxes();
    }

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
      console.log('form submitted:\n', f);

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
  fetchRoom(): void {
    // Get the room with the ID
    this._roomService.getRoomById(this.roomId).subscribe(
      (response: any) => {
        if (response.success) {
          // Room fetching was good, bind it to component
          this.room = response.data;

          // Check checkboxes
          this.checkInitialFacilities(response.data);
        } else {
          // Something went wrong with getting the room
          this.gettingRoomInfo = 'Sorry, the selected room was not found.';
          console.error(
            'An error occurred while trying to fetch the room:\n',
            response
          );
        }
      },
      error => {
        // Something went wrong when connecting to the API
        this.gettingRoomInfo =
          'An error occurred while trying to connecet to the API to get the room';
        console.error(
          'An error occurred while trying to connecet to the API to get the room',
          error
        );
      }
    );
  }

  async editRoom(f: NgForm): Promise<void> {
    this._roomService.updateRoom(this.prepareForm(f)).subscribe(
      (response: any) => {
        if (response.success) {
          this.fetchStatusForUser = 'Room successfully updated. Redirecting...';
          setTimeout(() => {
            this.router.navigateByUrl('/rooms/all');
          }, 1000);
        } else {
          this.notifyOfError(response, 'update');
        }
      },
      error => this.notifyOfError(error, 'update')
    );
  }

  async addRoom(f: NgForm): Promise<void> {
    this._roomService.addRoom(this.prepareForm(f)).subscribe(
      (response: any) => {
        if (response.success) {
          // Notify user of the success
          this.fetchStatusForUser = 'Room created successfully. Redirecting...';
          // Redirect to the room booking home page
          setTimeout(() => {
            this.router.navigateByUrl('/rooms/all');
          }, 1100);
        } else {
          // Notify user of the fail
          this.notifyOfError(response, 'create');
        }
      },
      error => {
        this.notifyOfError(error, 'create');
      }
    );
  }

  /**
   * Prepares form contents for submission
   *
   * @param {NgForm} f - form instance
   * @return JSON string
   */
  prepareForm(f: NgForm): string {
    const formBody = {
      ...f.form.value,
      images:
        typeof f.form.value.images === 'string'
          ? f.form.value.images.split(',')
          : f.form.value.images,
      facilities:
        typeof f.form.value.facilities === 'string'
          ? f.form.value.facilities.split(',')
          : this.prepareFacilities()
    };

    console.log(this.roomFacilities);
    console.log(JSON.stringify(formBody));
    return JSON.stringify(formBody);
  }

  /**
   * Opens a modal
   */
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'error-modal' });
  }

  /**
   * Closes modals and resets message to 'Loading...'
   */
  closeModal(): void {
    this.modalService.dismissAll();
    this.fetchStatusForUser = 'Loading...';
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

  fetchFacilities(): Promise<any> {
    // Get the room with the ID
    const promise = new Promise((resolve, reject) => {
      this._dictionaryService.getFacilities().subscribe(
        (response: any) => {
          if (response.success) {
            if (response.data === null) {
              // There is no 'facilities' key in the dictionary
              this.facilityStatus =
                'Facilities data is null. Please contact the site admin to add a `facilities` dictionary.';
              resolve(false);
            } else {
              // Facilities fetching was good
              if (response.data.values.length) {
                // Values exist, bind to component

                this.facilities = response.data.values;
                resolve(true);
              } else {
                this.showFacilitiesLink = true;
                this.facilityStatus =
                  'There are no facilities to display. Please add some facilities to proceed.';
                resolve(false);
              }
            }
          } else {
            // Something went wrong with getting the room
            this.facilityStatus = 'Error occurred while getting facilities';
            console.error(this.facilityStatus, response);
            resolve(false);
          }
        },
        error => {
          // Something went wrong when connecting to the API
          this.facilityStatus =
            'Error occurred while connecting to facilities API\n';
          console.error(this.facilityStatus, error);
          resolve(false);
        }
      );
    });

    return promise;
  }

  /**
   * Creates checkboxes for every facility that was returned from the API
   */
  createFacilityCheckboxes() {
    this.roomFacilities = this.facilities.map(fac => {
      return {
        value: fac,
        checked: false
      };
    });
  }

  /**
   * Updates facilities checkbox data
   *
   * @param event - Checkbox change event
   */
  updateFacility(event: Event) {
    const target = event.target as HTMLInputElement;

    const index = this.roomFacilities.findIndex(entry => {
      if (entry.value == target.value) {
        return true;
      }
    });

    this.roomFacilities[index].checked = !this.roomFacilities[index].checked;
  }

  /**
   * Selects the facility checkboxes if a room is loaded into the form
   *
   * @param roomData - all room data from API
   */
  checkInitialFacilities(roomData) {
    roomData.facilities.forEach(facility => {
      const index = this.roomFacilities.findIndex(roomFacility => {
        if (roomFacility.value === facility) {
          return true;
        }
      });
      if (index > -1) {
        this.roomFacilities[index].checked = true;
      }
    });
  }

  /**
   *  Returns only checked facilities for form submission
   *
   * @returns array of string facilities
   */
  prepareFacilities(): string[] {
    let values = [];

    this.roomFacilities.forEach(facility => {
      if (facility.checked) {
        values.push(facility.value);
      }
    });

    return values;
  }
}
