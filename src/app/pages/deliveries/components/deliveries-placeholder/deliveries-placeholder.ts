import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-deliveries-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './deliveries-placeholder.html',
  styleUrl: './deliveries-placeholder.css',
})
export class DeliveriesPlaceholder {
  protected skeletonItems: number[] = Array(5).fill(0);
}
