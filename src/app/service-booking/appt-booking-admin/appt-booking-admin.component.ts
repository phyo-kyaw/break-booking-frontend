import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApptBookingEntity } from 'app/service-booking/appt-booking-entity/models';
import { ApptBookingEntityDataService } from 'app/service/appt-booking-entity/appt-booking-entity-data.service';
import { Store } from '@ngrx/store';
import { Status } from 'app/store/reducer';

@Component({
  selector: 'app-appt-booking-admin',
  templateUrl: './appt-booking-admin.component.html',
  styleUrls: ['./appt-booking-admin.component.css']
})
export class ApptBookingAdminComponent implements OnInit {
  reducer$: Status;
  apptBookingEntity: ApptBookingEntity;
  apptBookingEntityList: ApptBookingEntity[];

  constructor(
    private apptBookingEntityDataService: ApptBookingEntityDataService,
    private router: Router,
    private store: Store<{ reducer: Status }>
  ) {
    this.store.select('reducer').subscribe(res => (this.reducer$ = res));
  }

  ngOnInit(): void {
    this.apptBookingEntityDataService
      .retrieveAllBookingEntities()
      .subscribe(response => {
        console.log(response);
        this.apptBookingEntityList = response;
        console.log(this.apptBookingEntityList);
      });
  }

  book(gid): void {
    console.log(gid);
    this.router.navigate(['select', gid]);
  }

  addApptBookingEntity(): void {
    this.router.navigate(['entity']);
  }

  update(gid): void {
    console.log(gid);
    this.router.navigate(['entity', gid]);
  }

  delete(gid): void {
    if (confirm('Confirm delete?')) {
      this.apptBookingEntityDataService
        .deleteBookingEntity(gid)
        .subscribe(response => {
          console.log('Entity deleted. ' + gid);
        });
      this.router.navigate(['list']);
    }
  }
}
