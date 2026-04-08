import { Component, computed, effect, inject, input, InputSignal, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { Package } from '@shared/types/package';
import { DeliveriesService } from 'app/pages/deliveries/deliveries-service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryPackagesPlaceholder } from '../../delivery-packages-placeholder/delivery-packages-placeholder';
import { TableModule } from 'primeng/table';
import { NgxMaskPipe } from 'ngx-mask';
import { TagModule } from 'primeng/tag';
import { PackageStatusPipe } from '@shared/pipes/package-status-pipe';
import { PackageStatusSeverityPipe } from '@shared/pipes/package-status-severity-pipe';
import { PackageStatusIconPipe } from '@shared/pipes/package-status-icon-pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

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
    PackageStatusIconPipe,
    ReactiveFormsModule
  ],
  templateUrl: './delivery-packages-by-owners.html',
  styleUrl: './delivery-packages-by-owners.css',
})
export class DeliveryPackagesByOwners implements OnDestroy {
  // services
  private readonly deliveriesService: DeliveriesService = inject(DeliveriesService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  deliveryId: InputSignal<number | null> = input<number | null>(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected packages: WritableSignal<Package[]> = signal([]);
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  protected filteredPackages: Signal<Package[]> = computed(() => {
    if (this.searchValue() === "") return this.packages();

    return this.packages().filter(p => {
      return p.customer.toLowerCase().includes(this.searchValue().toLowerCase()) 
        || p.deliveryMan.firstName.toLowerCase().includes(this.searchValue().toLowerCase())
        || p.place.toLowerCase().includes(this.searchValue().toLowerCase())
    });
  });

  constructor() {
    effect(() => {
      if (!this.deliveryId()) {
        this.isLoading.set(false);
        this.packages.set([]);
        this.searchControl.disable();
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
      if (packages.length > 0) this.searchControl.enable();
      else this.searchControl.disable();

      this.packages.set(packages);
    });
  }
}
