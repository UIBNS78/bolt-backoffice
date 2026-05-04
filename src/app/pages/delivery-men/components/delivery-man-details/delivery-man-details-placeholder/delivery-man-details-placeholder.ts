import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-man-details-placeholder',
  imports: [
    SkeletonModule,
    DividerModule
  ],
  templateUrl: './delivery-man-details-placeholder.html',
  styleUrl: './delivery-man-details-placeholder.css',
})
export class DeliveryManDetailsPlaceholder {}
