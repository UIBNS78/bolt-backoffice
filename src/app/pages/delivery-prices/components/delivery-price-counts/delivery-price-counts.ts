import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { DeliveryPricesService } from '../../delivery-prices-service';

@Component({
  selector: 'app-delivery-price-counts',
  imports: [
    SkeletonModule,
    PluralPipe
  ],
  templateUrl: './delivery-price-counts.html',
  styleUrl: './delivery-price-counts.css',
})
export class DeliveryPriceCounts implements OnInit {
  // services
  private readonly deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  
  // vars
  protected loading: WritableSignal<boolean> = signal(true);
  protected counts = this.deliveryPricesService.counts;

  ngOnInit(): void {
    // simulate loading
    setTimeout(() => {
      this.loading.set(false);
    }, 300);
  }
}
