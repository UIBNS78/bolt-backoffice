import { Component, signal, WritableSignal } from '@angular/core';
import { DeliveryCount } from '../../types/delivery-count';
import { SkeletonModule } from 'primeng/skeleton';
import { PluralPipe } from '@shared/pipes/plural.pipe';

@Component({
  selector: 'app-deliveries-count',
  imports: [
    SkeletonModule,
    PluralPipe
  ],
  templateUrl: './deliveries-count.html',
  styleUrl: './deliveries-count.css',
})
export class DeliveriesCount {
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected counts: WritableSignal<DeliveryCount> = signal({
    deliveryCount: 0,
    package: {
      total: 0,
      delivered: 0,
      cancelled: 0
    }
  });
}
