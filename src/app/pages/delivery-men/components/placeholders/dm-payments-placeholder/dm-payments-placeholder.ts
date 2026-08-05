import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dm-payments-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './dm-payments-placeholder.html',
  styleUrl: './dm-payments-placeholder.css',
})
export class DmPaymentsPlaceholder {}
