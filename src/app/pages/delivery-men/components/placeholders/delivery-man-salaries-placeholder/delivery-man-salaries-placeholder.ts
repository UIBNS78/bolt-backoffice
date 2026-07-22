import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-man-salaries-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './delivery-man-salaries-placeholder.html',
  styleUrl: './delivery-man-salaries-placeholder.css',
})
export class DeliveryManSalariesPlaceholder {}
