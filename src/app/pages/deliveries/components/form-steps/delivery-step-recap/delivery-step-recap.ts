import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { DeliveryForm } from 'app/pages/deliveries/types/delivery-form';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-delivery-step-recap',
  imports: [
    ButtonModule
  ],
  templateUrl: './delivery-step-recap.html',
  styleUrl: './delivery-step-recap.css',
})
export class DeliveryStepRecap {
  
  @Output() previousEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextEmitter: EventEmitter<void> = new EventEmitter<void>();
  loading: InputSignal<boolean> = input(false);
  data: InputSignal<DeliveryForm> = input.required();

  handlePrevious(): void {
    this.previousEmitter.emit(2);
  }

  handleNext(): void {
    this.nextEmitter.emit();
  }
}
