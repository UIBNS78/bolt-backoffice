import { Component, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-delivery-price-counts',
  imports: [
    SkeletonModule,
    PluralPipe
  ],
  templateUrl: './delivery-price-counts.html',
  styleUrl: './delivery-price-counts.css',
})
export class DeliveryPriceCounts {
  protected loading: WritableSignal<boolean> = signal(false);

  // TODO: call API for count
}
