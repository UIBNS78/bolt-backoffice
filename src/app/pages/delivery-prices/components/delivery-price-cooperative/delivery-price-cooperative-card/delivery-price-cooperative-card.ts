import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, Input, InputSignal, Output, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeliveryPriceCity, DeliveryPricePlace, DeliveryPriceProvince } from '@shared/types/delivery-price';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-delivery-price-cooperative-card',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ChipModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './delivery-price-cooperative-card.html',
  styleUrl: './delivery-price-cooperative-card.css',
})
export class DeliveryPriceCooperativeCard {
  @Output() showFormEmitter: EventEmitter<DeliveryPriceProvince> = new EventEmitter<DeliveryPriceProvince>();
  loading: InputSignal<boolean> = input<boolean>(false);
  deliveryPrice: InputSignal<DeliveryPriceProvince> = input.required<DeliveryPriceProvince>();

  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  protected data: Signal<DeliveryPriceProvince> = computed(() => {
    if (this.loading() || (this.deliveryPrice()?.cooperatives ?? []).length <= 0) {
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
  protected cooperatives: Signal<DeliveryPricePlace[]> = computed(() => {
    if (this.searchValue() === "") return this.data().cooperatives;
    
    return this.data().cooperatives.filter(p => p.name.toLowerCase().includes(this.searchValue().toLowerCase()));
  });

  handleShowForm(deliveryPrice: DeliveryPriceProvince): void {
    this.showFormEmitter.emit(deliveryPrice);
  }
}
