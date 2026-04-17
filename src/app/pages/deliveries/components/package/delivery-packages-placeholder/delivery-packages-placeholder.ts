import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-packages-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './delivery-packages-placeholder.html',
  styleUrl: './delivery-packages-placeholder.css',
})
export class DeliveryPackagesPlaceholder {}
