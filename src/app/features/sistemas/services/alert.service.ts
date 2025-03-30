import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private notification: NzNotificationService) {}

  success(title: string, content: string): void {
    this.notification.success(title, content, { nzDuration: 3000 });
  }

  error(title: string, content: string): void {
    this.notification.error(title, content, { nzDuration: 3000 });
  }

  warning(title: string, content: string): void {
    this.notification.warning(title, content, { nzDuration: 3000 });
  }
}
