import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dm-reward-rates-placeholder',
  imports: [
    SkeletonModule
  ],
  templateUrl: './dm-reward-rates-placeholder.html',
  styleUrl: './dm-reward-rates-placeholder.css',
})
export class DmRewardRatesPlaceholder {}
