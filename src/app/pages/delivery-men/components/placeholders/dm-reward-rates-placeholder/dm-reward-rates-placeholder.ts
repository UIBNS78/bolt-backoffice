import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dm-reward-rates-placeholder',
  imports: [
    SkeletonModule,
    DividerModule
  ],
  templateUrl: './dm-reward-rates-placeholder.html',
  styleUrl: './dm-reward-rates-placeholder.css',
})
export class DmRewardRatesPlaceholder {}
