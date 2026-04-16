import { NgClass } from '@angular/common';
import { Component, effect, EventEmitter, inject, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { DeliveryStatusSeverityPipe } from '@shared/pipes/delivery-pipes/delivery-status-severity-pipe';
import { DeliveryStatusPipe } from '@shared/pipes/delivery-pipes/delivery-status.pipe';
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
import { Delivery } from '@shared/types/delivery';
import { DeliveryStatusIconPipe } from '@shared/pipes/delivery-pipes/delivery-status-icon-pipe';
import { AvatarModule } from 'primeng/avatar';
import { BigramPipe } from '@shared/pipes/bigram.pipe';

@Component({
  selector: 'app-deliveries-by-owners',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    DeliveryStatusPipe,
    DeliveryStatusIconPipe,
    DeliveryStatusSeverityPipe,
    NgClass,
    DividerModule,
    ButtonModule,
    TooltipModule,
    TodayYesterdayTomorrowPipe,
    DeliveriesPlaceholder,
    CivilityPipe,
    AvatarModule,
    BigramPipe
  ],
  templateUrl: './deliveries-by-owners.html',
  styleUrl: './deliveries-by-owners.css',
})
export class DeliveriesByOwners implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // servives
  private readonly deliviverisService: DeliveriesService = inject(DeliveriesService);

  // vars
  @Output() onSelectEmitter: EventEmitter<Delivery> = new EventEmitter<Delivery>();
  protected showScroll: WritableSignal<boolean> = signal(false);
  protected selectedDelivery: WritableSignal<Delivery | null> = signal(null);
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryList> = signal({
    deliveries: [],
    totalItems: 0
  });

  constructor() {
    effect(() => {
      const newData: DeliveryList = this.data();
      const newSelectedDelivery: Delivery | undefined = newData.deliveries.flatMap(d => d.deliveries).find(d => d.id === this.selectedDelivery()?.id);
      if (newSelectedDelivery) this.handleSelectDelivery(newSelectedDelivery);
    });
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliviverisService.getDeliveriesByOwners({ page: this.first() / this.rows() + 1, itemsPerPage: this.rows()}).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }

  handleSelectDelivery(delivery: Delivery): void {
    this.selectedDelivery.set(delivery);
    this.onSelectEmitter.emit(delivery);
  }

  onScroll(event: any) {
    this.showScroll.set(event.target.scrollTop > 200);
  }

  scrollToTop(container: HTMLElement) {
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
