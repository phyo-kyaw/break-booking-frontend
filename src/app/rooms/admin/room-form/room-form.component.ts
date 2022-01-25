import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Room } from '../../model/room';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomService } from 'app/service/rooms/room.service';
import { ImagesService } from 'app/service/images/images.service';
import { DictionaryService } from 'app/service/dictionaries/dictionary.service';
import { environment as env } from 'environments/environment';

interface uploadResponse {
  success: boolean;
  imageSrc?: string;
}

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
  /**
   * All possible cities from API
   */
  allCities: string[] = [];
  /**
   * All possible facilities from API
   */
  facilities: string[] = [];
  facilityStatus = 'Getting facilities...';
  showDictionaryLink = false;
  /**
   * Facilities that the room has
   */
  roomFacilities: { value: string; checked: boolean }[] = [];
  cityStatus = 'Getting cities...';
  showCityLink = false;
  images: File[] = null;
  previews = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private modalService: NgbModal,
    private _roomService: RoomService,
    private _dictionaryService: DictionaryService,
    private _imagesService: ImagesService
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
    const dictionariesResolved = await this.fetchFacilities();
    await this.fetchCities();

    if (dictionariesResolved) {
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
  async onSubmit(f: NgForm): Promise<void> {
    // Check if all the fields are valid
    if (f.valid) {
      // Show loading screen
      this.isLoading = true;
      const formImage: string | string[] = f.form.value.images;
      let uploadResponse: uploadResponse[] | string[] = [];
      //check if image need upload to S3 first
      //if images not uploaded yet (formImage as string: file path of local mechine)
      if (typeof formImage === 'string') {
        try {
          uploadResponse = await this.uploadImages();
          uploadResponse = uploadResponse
            .filter(result => {
              if (!result.success)
                console.error('some file did not upload successfully');
              return result.success;
            })
            .map(result => result.imageSrc);
        } catch (err) {
          console.error(`Error occurred while uploading images : ${err}`);
        }
      } else {
        uploadResponse = formImage;
      }

      const formData = this.prepareForm(f, uploadResponse as string[]);
      this.fetchStatusForUser = 'Saving room...';
      if (this.roomId.trim().length) {
        this.editRoom(formData);
      } else {
        this.addRoom(formData);
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
    this._roomService.getRoomById(this.roomId).subscribe(
      (response: any) => {
        if (response.success) {
          // Room fetching was good, bind it to component
          this.room = response.data;
          this.previews = response.data.images;
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

  editRoom(f: string): void {
    // TODO: investigate why roomService is not able to submit the room for update
    fetch(`${env.roomsApi}/update`, {
      method: 'PUT',
      body: f,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          this.fetchStatusForUser = 'Room successfully updated. Redirecting...';
          setTimeout(() => {
            this.router.navigateByUrl('/rooms/all');
          }, 1000);
        } else {
          this.notifyOfError(result, 'update');
        }
      })
      .catch(error => this.notifyOfError(error, 'update'));

    // this._roomService.updateRoom(f).subscribe(
    //   (response: any) => {
    //     if (response.success) {
    //       this.fetchStatusForUser = 'Room successfully updated. Redirecting...';
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/rooms/all');
    //       }, 1000);
    //     } else {
    //       this.notifyOfError(response, 'update');
    //     }
    //   },
    //   error => this.notifyOfError(error, 'update')
    // );
  }

  addRoom(f: string): void {
    // TODO: investigate why roomService is not able to submit the room
    fetch(`${env.roomsApi}/add`, {
      method: 'POST',
      body: f,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // Notify user of the success
          this.fetchStatusForUser = 'Room created successfully. Redirecting...';
          // Redirect to the room booking home page
          setTimeout(() => {
            this.router.navigateByUrl('/rooms/all');
          }, 1100);
        } else {
          // Notify user of the fail
          this.notifyOfError(result, 'create');
        }
      })
      .catch(error => this.notifyOfError(error, 'create'));

    // this._roomService.addRoom(f).subscribe(
    //   (response: any) => {
    //     if (response.success) {
    //       // Notify user of the success
    //       this.fetchStatusForUser = 'Room created successfully. Redirecting...';
    //       // Redirect to the room booking home page
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/rooms/all');
    //       }, 1100);
    //     } else {
    //       // Notify user of the fail
    //       this.notifyOfError(response, 'create');
    //     }
    //   },
    //   error => {
    //     this.notifyOfError(error, 'create');
    //   }
    // );
  }

  /**
   * Prepares form contents for submission
   *
   * @param {NgForm} f - form instance
   * @return JSON string
   */
  prepareForm(f: NgForm, imageUrls: string[]): string {
    const formBody = {
      ...f.form.value,
      facilities:
        typeof f.form.value.facilities === 'string'
          ? f.form.value.facilities.split(',')
          : this.prepareFacilities(),
      reservedDates: this.room.reservedDates,
      images: imageUrls
    };
    return JSON.stringify(formBody);
  }

  /**
   * Store file to images variable and preview selected files
   *
   * @param event - file input
   */
  onFileSelected(event) {
    this.images = event.target.files;
    this.previews = [];
    if (this.images && this.images[0]) {
      const numberOfFiles = this.images.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.images[i]);
      }
    }
  }

  /**
   * Delete uploaded file
   *
   * @param i - index of a file to be deleted
   */
  deleteImage(i) {
    console.log(this.images);
    //if file not saved yet
    if (this.images) {
      let newIMGList = [...this.images];
      this.previews.splice(i, 1);
      newIMGList.splice(i, 1);
      this.images = newIMGList;
    } else {
      this.room.images.splice(i, 1);
    }
  }

  uploadImages(): Promise<uploadResponse[]> {
    this.fetchStatusForUser = 'Uploading image...';
    return this._imagesService.uploadImages(this.images).toPromise();
  }

  // uploadImages(): Promise<uploadResponse> {
  //   return new Promise((resolve, reject) => {
  //     this.fetchStatusForUser = 'Uploading image...';

  //     this._imagesService.uploadImages(this.images).subscribe(
  //       (response: any) => {
  //         if (response.success) {
  //           resolve({ success: true, imageSrc: response.data.url });
  //         } else {
  //           // Something went wrong with upload
  //           console.error('Error occured while uploading image:\n', response);
  //           reject({ success: false });
  //         }
  //       },
  //       error => {
  //         // Request error when uploading form
  //         console.error(
  //           'An error occurred while connecting to the API for uploading images',
  //           error
  //         );
  //         reject({ success: false });
  //       }
  //     );
  //   });
  // }

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
                this.showDictionaryLink = true;
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

  fetchCities(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this._dictionaryService.getCities().subscribe(
        (response: any) => {
          if (response.success) {
            if (response.data === null) {
              // There is no 'cities' key in the dictionary
              this.facilityStatus =
                'Cities data is null. Please contact the site admin to add a `cities` dictionary.';
              resolve(false);
            } else {
              // Cities fetching was good
              if (response.data.values.length) {
                // Values exist, bind to component

                this.allCities = response.data.values;
                resolve(true);
              } else {
                this.showCityLink = true;
                this.cityStatus =
                  'There are no cities to display. Please add some cities to proceed.';
                resolve(false);
              }
            }
          } else {
            // Something went wrong with getting the cities
            this.cityStatus = 'Error occurred while getting cities';
            console.error(this.cityStatus, response);
            resolve(false);
          }
        },
        error => {
          // Something went wrong when connecting to the API
          this.facilityStatus =
            'Error occurred while connecting to cities API\n';
          console.error(this.cityStatus, error);
          resolve(false);
        }
      );
    });

    return promise;
  }

  /**
   * Whenever user select a date, push it into room.reservedDates
   */
  onDateSelect(event: NgbDateStruct): void {
    // 1 -> 01
    const Dateformatter = (month_or_day: number): string => {
      if (month_or_day < 10) return `0${month_or_day}`;
      return month_or_day.toString();
    };
    //format: 2022/01/01
    const selectedDate = `${event.year}-${Dateformatter(
      event.month
    )}-${Dateformatter(event.day)}`;

    if (this.room.reservedDates) {
      this.room.reservedDates = [...this.room.reservedDates, selectedDate];
    } else {
      this.room.reservedDates = [selectedDate];
    }
  }

  /**
   * if reserved date is undefined. then return an empty array
   */
  checkInitialReserved() {
    if (!this.room.reservedDates) {
      return [];
    }
    return this.room.reservedDates;
  }
}
