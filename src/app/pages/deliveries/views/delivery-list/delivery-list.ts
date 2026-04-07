import { Component, signal, WritableSignal } from '@angular/core';
import { DeliveriesCount } from '../../components/deliveries-count/deliveries-count';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DeliveryList as DeliveryListType } from '../../types/delivery-list';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DeliveriesByOwner } from '../../components/deliveries-by-owner/deliveries-by-owner';
import { DeliveriesByMen } from '../../components/deliveries-by-men/deliveries-by-men';
import { TabsModule } from 'primeng/tabs';

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
    DeliveriesByOwner,
    DeliveriesByMen
  ],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList {
  protected selectedDelivery: WritableSignal<number | null> = signal(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryListType> = signal({
    deliveries: [],
    totalItems: 0
  });
  protected tabs: { id: number; label: string; icon: string }[] = [
    { id: 0, label: "Propriétaires", icon: "pi pi-users" },
    { id: 1, label: "Livreurs", icon: "pi pi-truck" }
  ];

  handleOpenForm(): void {}
}
