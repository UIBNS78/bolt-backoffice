import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-notification-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './notification-placeholder.html',
  styleUrl: './notification-placeholder.css',
})
export class NotificationPlaceholder {
  protected items: number[] = Array.from({ length: 6 }, (_, i) => i);
}
