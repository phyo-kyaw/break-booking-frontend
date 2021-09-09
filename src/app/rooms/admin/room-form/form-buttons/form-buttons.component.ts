import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-buttons',
  templateUrl: './form-buttons.component.html',
  styleUrls: ['./form-buttons.component.css']
})
export class FormButtonsComponent implements OnInit {
  @Input() isEditForm: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
