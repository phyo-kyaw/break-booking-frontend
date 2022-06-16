import { Component, OnInit, TemplateRef } from '@angular/core';

import { ToastService } from 'app/service/toast/toast-service.service';

@Component({
  selector: 'app-toast-global',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 3000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {
    class: 'app-toast-global position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200'
  }
})
export class ToastGlobalComponent implements OnInit {
  constructor(public toastService: ToastService) {}
  ngOnInit() {}
  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
