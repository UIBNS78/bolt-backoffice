import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { DeliveryStatusSeverityPipe } from '@shared/pipes/delivery-status-severity-pipe';
import { DeliveryStatusPipe } from '@shared/pipes/delivery-status.pipe';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';
import { DeliveriesService } from 'app/pages/deliveries/deliveries-service';
import { DeliveryList } from 'app/pages/deliveries/types/delivery-list';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesPlaceholder } from '../../deliveries-placeholder/deliveries-placeholder';
import { CivilityPipe } from '@shared/pipes/civility-pipe';

@Component({
  selector: 'app-deliveries-by-owners',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    DeliveryStatusPipe,
    DeliveryStatusSeverityPipe,
    NgClass,
    DividerModule,
    ButtonModule,
    TooltipModule,
    TodayYesterdayTomorrowPipe,
    DeliveriesPlaceholder,
    CivilityPipe
  ],
  templateUrl: './deliveries-by-owners.html',
  styleUrl: './deliveries-by-owners.css',
})
export class DeliveriesByOwners implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // servives
  private readonly deliviverisService: DeliveriesService = inject(DeliveriesService);

  // vars
  @Output() onSelectEmitter: EventEmitter<number> = new EventEmitter<number>();
  protected selectedDelivery: WritableSignal<number | null> = signal(null);
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryList> = signal({
    deliveries: [],
    totalItems: 0
  });

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  loadData(): void {
    this.deliviverisService.getDeliveriesByOwners({ page: this.first() / this.rows() + 1, itemsPerPage: this.rows()}).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }

  handleSelectDelivery(deliveryId: number): void {
    this.selectedDelivery.set(deliveryId);
    this.onSelectEmitter.emit(deliveryId);
  }
}
