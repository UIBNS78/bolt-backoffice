import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { DeliveryManInformations } from './delivery-man-informations/delivery-man-informations';
import { DeliveryManData } from './delivery-man-data/delivery-man-data';
import { DeliveryManHistory } from './delivery-man-history/delivery-man-history';
import { Subject } from 'rxjs';
import { DeliveryMenService } from '../../delivery-men-service';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-delivery-man-details',
  imports: [
    DrawerModule,
    AvatarModule,
    SelectButtonModule,
    FormsModule,
    DeliveryManInformations,
    DeliveryManData,
    DeliveryManHistory
  ],
  templateUrl: './delivery-man-details.html',
  styleUrl: './delivery-man-details.css',
})
export class DeliveryManDetails implements OnInit, OnDestroy {
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() deliveryManId: number | null = null;
  
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  // vars
  protected selected: number = 1;
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected currentTab: WritableSignal<number> = signal(0);
  protected tabs: { id: number; label: string; }[] = [
    { id: 0, label: "A propos"},
    { id: 1, label: "Données" },
    { id: 2, label: "Historique" },
  ];

  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    
  }
    
  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
