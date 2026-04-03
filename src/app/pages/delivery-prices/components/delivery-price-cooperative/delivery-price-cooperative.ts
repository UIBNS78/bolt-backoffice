import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { DeliveryPricesService } from '../../delivery-prices-service';
import { DeliveryPriceProvince } from '@shared/types/delivery-price';
import { DeliveryPriceCooperativeCard } from './delivery-price-cooperative-card/delivery-price-cooperative-card';
import { DeliveryPricePlaceholder } from '../delivery-price-placeholder/delivery-price-placeholder';
import { DeliveryPriceCooperativeForm } from './delivery-price-cooperative-form/delivery-price-cooperative-form';

@Component({
  selector: 'app-delivery-price-cooperative',
  imports: [
    DeliveryPriceCooperativeCard,
    DeliveryPricePlaceholder,
    DeliveryPriceCooperativeForm
  ],
  templateUrl: './delivery-price-cooperative.html',
  styleUrl: './delivery-price-cooperative.css',
})
export class DeliveryPriceCooperative implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // services
  private deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  // vars
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryPriceProvince[]> = signal([]);
  protected showForm: WritableSignal<boolean> = signal(false);
  protected selectedLocation: WritableSignal<DeliveryPriceProvince | undefined> = signal(undefined);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliveryPricesService.getAllCooperative().pipe(
      first(),
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(deliveryPrices => {
      this.data.set(deliveryPrices);
    });
  }

  handleShowForm(deliveryPrice: DeliveryPriceProvince | undefined = undefined): void {
    this.selectedLocation.set(deliveryPrice);
    this.showForm.update(prev => {
      if (prev) {
        this.loadData();
        return false;
      }
      
      return true;
    });
  }

}
