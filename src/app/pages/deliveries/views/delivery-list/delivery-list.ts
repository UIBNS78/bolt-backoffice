import { Component, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { DeliveriesCount } from '../../components/delivery/deliveries-count/deliveries-count';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DeliveriesList } from '../../components/delivery/deliveries-list/deliveries-list';
import { Delivery } from '@shared/types/delivery';
import { DeliveryPackagesList } from '../../components/package/delivery-packages-list/delivery-packages-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delivery-list',
  imports: [
    DeliveriesCount,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    FormsModule,
    DeliveriesList,
    DeliveryPackagesList,
    RouterLink
  ],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList {
  private readonly deliveryByOwnerChild: Signal<DeliveriesList | undefined> = viewChild(DeliveriesList);

  protected selectedDelivery: WritableSignal<Delivery | null> = signal(null); 

  handleOnSelectDelivery(delivery: Delivery): void {
    this.selectedDelivery.set(delivery);
  }

  handleReloadDeliveries(): void {
    this.deliveryByOwnerChild()!.loadData();
  }
  
  handleOpenForm(): void {}
}
