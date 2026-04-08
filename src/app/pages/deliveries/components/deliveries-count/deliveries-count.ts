import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DeliveryCount } from '../../types/delivery-count';
import { SkeletonModule } from 'primeng/skeleton';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { DeliveriesService } from '../../deliveries-service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-deliveries-count',
  imports: [
    SkeletonModule,
    PluralPipe
  ],
  templateUrl: './deliveries-count.html',
  styleUrl: './deliveries-count.css',
})
export class DeliveriesCount implements OnInit, OnDestroy {
  // services
  private readonly deliveriesService: DeliveriesService = inject(DeliveriesService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected counts: WritableSignal<DeliveryCount> = signal({
    deliveryCount: 0,
    package: {
      total: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliveriesService.getDeliveryCount().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(counts => {
      this.counts.set(counts);
      this.isLoading.set(false);
    });
  }
}
