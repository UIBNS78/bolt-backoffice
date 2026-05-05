import { Component, effect, EventEmitter, inject, input, InputSignal, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { DeliveryManInformations } from './delivery-man-informations/delivery-man-informations';
import { DeliveryManData } from './delivery-man-data/delivery-man-data';
import { DeliveryManHistory } from './delivery-man-history/delivery-man-history';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryMenService } from '../../delivery-men-service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DeliveryManDetails as DMDetails } from '@shared/types/delivery-men';
import { SeniorityPipe } from '@shared/pipes/seniority.pipe';
import { DeliveryManDetailsPlaceholder } from './delivery-man-details-placeholder/delivery-man-details-placeholder';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-delivery-man-details',
  imports: [
    DrawerModule,
    AvatarModule,
    SelectButtonModule,
    FormsModule,
    DeliveryManInformations,
    DeliveryManData,
    DeliveryManHistory,
    SeniorityPipe,
    DeliveryManDetailsPlaceholder,
    OverlayBadgeModule
  ],
  templateUrl: './delivery-man-details.html',
  styleUrl: './delivery-man-details.css',
})
export class DeliveryManDetails implements OnDestroy {
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  open: InputSignal<boolean> = input(false);
  deliveryManId: InputSignal<number | null> = input.required();
  
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  // vars
  protected loading: WritableSignal<boolean> = signal(false);
  protected selected: number = 1;
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected currentTab: WritableSignal<number> = signal(0);
  protected tabs: { id: number; label: string; }[] = [
    { id: 0, label: "A propos"},
    { id: 1, label: "Données" },
    { id: 2, label: "Historique" },
  ];
  protected data: WritableSignal<DMDetails | null> = signal(null);

  constructor() {
    effect(() => {
      if (this.open() ) {
        this.loadData();
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    if (!this.deliveryManId()) {
      return;
    }

    this.loading.set(true);
    this.deliveryMenService.getDetails(this.deliveryManId()!).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe((response) => {
      this.data.set(response);
    });
  }
    
  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
