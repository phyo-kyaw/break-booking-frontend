import { Component, OnInit } from '@angular/core';
import { EventBookingService } from 'app/service/event-booking/event-booking.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  bookingID: string;
  bookingDetail;
  eventDetail;
  isLoading;
  loadingText;

  constructor(
    private eventBookingService: EventBookingService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.bookingID = params.id;
      console.log(params);
    });

    this.getBookingDetail();
  }

  getBookingDetail() {
    this.eventBookingService.getBookingByID(this.bookingID).subscribe(res => {
      console.log('booking', res);
      this.bookingDetail = res;
      this.eventBookingService.getEventbyID(res.eventEid).subscribe(res => {
        console.log('event', res);
        this.eventDetail = res;
      });
    });
  }

  onConfirm() {
    this.route.navigate(['/event/all']);
  }
}
