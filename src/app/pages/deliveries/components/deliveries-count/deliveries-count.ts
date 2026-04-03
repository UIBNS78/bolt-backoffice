import { Component, input, InputSignal } from '@angular/core';
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
  loading: InputSignal<boolean> = input<boolean>(false);
  counts: InputSignal<DeliveryCount> = input.required<DeliveryCount>();
}
