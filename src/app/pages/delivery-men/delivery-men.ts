import { Component, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-delivery-men',
  imports: [
    SkeletonModule,
    BadgeModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
    PluralPipe
  ],
  templateUrl: './delivery-men.html',
  styleUrl: './delivery-men.css',
})
export class DeliveryMen {
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected activeCounts: WritableSignal<number> = signal(0);
}
