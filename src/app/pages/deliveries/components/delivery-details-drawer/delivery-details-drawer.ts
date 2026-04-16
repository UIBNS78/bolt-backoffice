import { DatePipe, NgClass } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, InputSignal, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { DeliveryStatusIconPipe } from '@shared/pipes/delivery-pipes/delivery-status-icon-pipe';
import { DeliveryStatusSeverityPipe } from '@shared/pipes/delivery-pipes/delivery-status-severity-pipe';
import { DeliveryStatusPipe } from '@shared/pipes/delivery-pipes/delivery-status.pipe';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { DeliveryDetails } from '../../types/delivery-details';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';
import { BigramPipe } from '@shared/pipes/bigram.pipe';

@Component({
  selector: 'app-delivery-details-drawer',
  imports: [
    DrawerModule,
    PanelModule,
    AvatarModule,
    TooltipModule,
    TagModule,
    SkeletonModule,
    DeliveryStatusPipe,
    DeliveryStatusSeverityPipe,
    DeliveryStatusIconPipe,
    NgClass,
    CivilityPipe,
    DatePipe,
    TodayYesterdayTomorrowPipe,
    BigramPipe
  ],
  templateUrl: './delivery-details-drawer.html',
  styleUrl: './delivery-details-drawer.css',
})
export class DeliveryDetailsDrawer implements OnDestroy {
  // services
  private readonly deliveryService: DeliveriesService = inject(DeliveriesService);

  // vars
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  open: InputSignal<boolean> = input(false);
  deliveryId: InputSignal<number | undefined> = input<number | undefined>(undefined);
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryDetails | null> = signal(null);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadData(): void {
    if (!this.deliveryId()) {
      return;
    }

    this.isLoading.set(true);
    this.deliveryService.getDeliveryDetails(this.deliveryId()!).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }
  
  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
