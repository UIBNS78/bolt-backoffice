import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-men-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './delivery-men-placeholder.html',
  styleUrl: './delivery-men-placeholder.css',
})
export class DeliveryMenPlaceholder {}
