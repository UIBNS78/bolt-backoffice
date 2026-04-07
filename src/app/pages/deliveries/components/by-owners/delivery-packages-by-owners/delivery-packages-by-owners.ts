import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-packages-by-owners',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './delivery-packages-by-owners.html',
  styleUrl: './delivery-packages-by-owners.css',
})
export class DeliveryPackagesByOwners {
  // vars
  deliveryId: InputSignal<number | null> = input<number | null>(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
}
