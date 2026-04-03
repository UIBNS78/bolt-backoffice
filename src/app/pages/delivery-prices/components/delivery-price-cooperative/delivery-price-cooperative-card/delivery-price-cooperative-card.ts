import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
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
  private _data: DeliveryPriceProvince | null = null;
  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  
  @Output() showFormEmitter: EventEmitter<DeliveryPriceProvince> = new EventEmitter<DeliveryPriceProvince>();
  @Input() loading: boolean = false;
  @Input() 
  set data(data: DeliveryPriceProvince | null) {
    if (!data) return;

    if (this.loading || (data.cooperatives ?? []).length <= 0) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }

    this._data = data;
  }
  get data(): DeliveryPriceProvince | null {
    return this._data;
  };
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  protected cooperatives: Signal<DeliveryPricePlace[]> = computed(() => {
    if (!this.data) return [];
    
    if (this.searchValue() === "") return this.data.cooperatives;
    
    return this.data.cooperatives.filter(p => p.name.toLowerCase().includes(this.searchValue().toLowerCase()));
  });

  handleShowForm(deliveryPrice: DeliveryPriceProvince): void {
    this.showFormEmitter.emit(deliveryPrice);
  }
}
