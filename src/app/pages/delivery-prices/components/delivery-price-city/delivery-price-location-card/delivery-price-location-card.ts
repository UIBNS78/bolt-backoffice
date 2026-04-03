import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeliveryPriceCity, DeliveryPricePlace } from '@shared/types/delivery-price';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-delivery-price-location-card',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ChipModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './delivery-price-location-card.html',
  styleUrl: './delivery-price-location-card.css',
})
export class DeliveryPriceLocationCard {
  protected searchControl: FormControl<string> = new FormControl("", { nonNullable: true });
  
  @Output() showFormEmitter: EventEmitter<DeliveryPriceCity> = new EventEmitter<DeliveryPriceCity>();
  @Input() loading: boolean = false;
  @Input() data: DeliveryPriceCity | null = null;
  
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  protected places: Signal<DeliveryPricePlace[]> = computed(() => {
    if (!this.data) return [];
    
    if (this.searchValue() === "") return this.data.places;
    
    return this.data.places.filter(p => p.name.toLowerCase().includes(this.searchValue().toLowerCase()));
  });

  handleShowForm(deliveryPrice: DeliveryPriceCity): void {
    this.showFormEmitter.emit(deliveryPrice);
  }
}
