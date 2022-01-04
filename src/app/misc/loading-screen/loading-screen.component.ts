import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() text: string = 'Loading...';

  constructor() {}

  ngOnInit(): void {}
}
