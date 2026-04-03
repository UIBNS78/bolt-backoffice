import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, Input, InputSignal, Output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DeliveryPriceCity, DeliveryPricePlace } from '@shared/types/delivery-price';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-delivery-price-city-card',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ChipModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './delivery-price-city-card.html',
  styleUrl: './delivery-price-city-card.css',
})
export class DeliveryPriceCityCard {
  @Output() showFormEmitter: EventEmitter<DeliveryPriceCity> = new EventEmitter<DeliveryPriceCity>();
  loading: InputSignal<boolean> = input<boolean>(false);
  deliveryPrice: InputSignal<DeliveryPriceCity> = input.required<DeliveryPriceCity>();
  
  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  protected data: Signal<DeliveryPriceCity> = computed(() => {
    if (this.loading() || (this.deliveryPrice()?.places ?? []).length <= 0) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }

    return this.deliveryPrice();
  });
  
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  
  protected places: Signal<DeliveryPricePlace[]> = computed(() => {    
    if (this.searchValue() === "") return this.data().places;
    
    return this.data().places.filter(p => p.name.toLowerCase().includes(this.searchValue().toLowerCase()));
  });

  handleShowForm(deliveryPrice: DeliveryPriceCity): void {
    this.showFormEmitter.emit(deliveryPrice);
  }
}
