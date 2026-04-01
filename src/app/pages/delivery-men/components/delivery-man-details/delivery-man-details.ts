import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { DeliveryManInformations } from './delivery-man-informations/delivery-man-informations';
import { DeliveryManData } from './delivery-man-data/delivery-man-data';
import { DeliveryManHistory } from './delivery-man-history/delivery-man-history';

@Component({
  selector: 'app-delivery-man-details',
  imports: [
    DrawerModule,
    AvatarModule,
    TabsModule,
    FormsModule,
    DeliveryManInformations,
    DeliveryManData,
    DeliveryManHistory
  ],
  templateUrl: './delivery-man-details.html',
  styleUrl: './delivery-man-details.css',
})
export class DeliveryManDetails {
  
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() deliveryManId: number | null = null;
  
  protected currentTab: WritableSignal<number> = signal(0);
  protected tabs: { id: number; label: string; icon: string }[] = [
    { id: 0, label: "A propos", icon: "pi pi-info-circle" },
    { id: 1, label: "Données", icon: "pi pi-chart-line" },
    { id: 2, label: "Historique", icon: "pi pi-history" },
  ];
    
  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
