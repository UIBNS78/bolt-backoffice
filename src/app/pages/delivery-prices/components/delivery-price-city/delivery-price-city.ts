import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { DeliveryPricesService } from '../../delivery-prices-service';
import { type DeliveryPriceCity as DeliveryPriceCityType } from '@shared/types/delivery-price';
import { DeliveryPricePlaceholder } from '../delivery-price-placeholder/delivery-price-placeholder';
import { NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-delivery-price-city',
  imports: [
    DeliveryPricePlaceholder,
    CardModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    BadgeModule,
    NgClass
  ],
  templateUrl: './delivery-price-city.html',
  styleUrl: './delivery-price-city.css',
})
export class DeliveryPriceCity implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // vars
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryPriceCityType[]> = signal([]);
  // services
  private deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliveryPricesService.getAllTana().pipe(
      first(),
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(deliveryPrices => {
      this.data.set(deliveryPrices);
    });
  }

  handleUpdate(deliveryPrice: DeliveryPriceCityType): void {}
}
