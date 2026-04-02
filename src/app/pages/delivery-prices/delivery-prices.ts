import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { DeliveryPriceCounts } from './components/delivery-price-counts/delivery-price-counts';
import { DeliveryPriceCity } from './components/delivery-price-city/delivery-price-city';
import { DeliveryPriceCooperative } from './components/delivery-price-cooperative/delivery-price-cooperative';

@Component({
  selector: 'app-delivery-prices',
  imports: [
    TabsModule,
    DeliveryPriceCounts,
    DeliveryPriceCity,
    DeliveryPriceCooperative
  ],
  templateUrl: './delivery-prices.html',
  styleUrl: './delivery-prices.css',
})
export class DeliveryPrices {
  
  protected tabs: { id: number; label: string; icon: string }[] = [
    { id: 0, label: "Clients à Antananarivo", icon: "pi pi-building" },
    { id: 1, label: "Clients en province", icon: "pi pi-truck" }
  ];
}
