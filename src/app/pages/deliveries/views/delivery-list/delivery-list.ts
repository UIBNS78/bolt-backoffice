import { Component, signal, WritableSignal } from '@angular/core';
import { DeliveriesCount } from '../../components/deliveries-count/deliveries-count';
import { DeliveryCount } from '../../types/delivery-count';

@Component({
  selector: 'app-delivery-list',
  imports: [
    DeliveriesCount
  ],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList {
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
