import { Component, effect, inject, input, InputSignal, OnDestroy, signal, WritableSignal } from '@angular/core';
import { Package } from '@shared/types/package';
import { DeliveriesService } from 'app/pages/deliveries/deliveries-service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryPackagesPlaceholder } from '../../delivery-packages-placeholder/delivery-packages-placeholder';
import { TableModule } from 'primeng/table';
import { NgxMaskPipe } from 'ngx-mask';
import { TagModule } from 'primeng/tag';
import { PackageStatusPipe } from '@shared/pipes/package-status-pipe';
import { PackageStatusSeverityPipe } from '@shared/pipes/package-status-severity-pipe';
import { PackageStatusIconPipe } from '@shared/pipes/package-status-icon-pipe';

@Component({
  selector: 'app-delivery-packages-by-owners',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    DeliveryPackagesPlaceholder,
    TableModule,
    NgxMaskPipe,
    TagModule,
    PackageStatusPipe,
    PackageStatusSeverityPipe,
    PackageStatusIconPipe
  ],
  templateUrl: './delivery-packages-by-owners.html',
  styleUrl: './delivery-packages-by-owners.css',
})
export class DeliveryPackagesByOwners implements OnDestroy {
  // services
  private readonly deliveriesService: DeliveriesService = inject(DeliveriesService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  deliveryId: InputSignal<number | null> = input<number | null>(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected packages: WritableSignal<Package[]> = signal([]);

  constructor() {
    effect(() => {
      if (!this.deliveryId()) {
        this.isLoading.set(false);
        this.packages.set([]);
        return;
      }

      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.deliveriesService.getPackagesByOwnersByDeliveryId(this.deliveryId()!).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(packages => {
      this.packages.set(packages);
    });
  }
}
