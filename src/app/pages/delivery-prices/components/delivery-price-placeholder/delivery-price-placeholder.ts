import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-price-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './delivery-price-placeholder.html',
  styleUrl: './delivery-price-placeholder.css',
})
export class DeliveryPricePlaceholder {}
