import { Component, signal, WritableSignal } from '@angular/core';
import { DeliveriesCount } from '../../components/deliveries-count/deliveries-count';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DeliveryList as DeliveryListType } from '../../types/delivery-list';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DeliveriesByOwners } from '../../components/by-owners/deliveries-by-owners/deliveries-by-owners';
import { DeliveriesByMen } from '../../components/by-men/deliveries-by-men/deliveries-by-men';
import { TabsModule } from 'primeng/tabs';
import { DeliveryPackagesByOwners } from '../../components/by-owners/delivery-packages-by-owners/delivery-packages-by-owners';
import { DeliveryPackagesByMen } from '../../components/by-men/delivery-packages-by-men/delivery-packages-by-men';

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
    TabsModule,
    DeliveriesByOwners,
    DeliveryPackagesByOwners,
    DeliveryPackagesByMen,
    DeliveriesByMen
  ],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList {
  protected selectedDeliveryId: WritableSignal<number | null> = signal(null); 
  protected tabs: { id: number; label: string; icon: string }[] = [
    { id: 0, label: "Propriétaires", icon: "pi pi-users" },
    { id: 1, label: "Livreurs", icon: "pi pi-truck" }
  ];

  handleOnSelectDelivery(deliveryId: number): void {
    this.selectedDeliveryId.set(deliveryId);
  }
  
  handleOpenForm(): void {}

  onTabChange(): void {
    this.selectedDeliveryId.set(null);
  }
}
