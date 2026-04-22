import { Component } from '@angular/core';
import { DeliveryPriceCounts } from './components/delivery-price-counts/delivery-price-counts';
import { DeliveryPriceCity } from './components/delivery-price-city/delivery-price-city';
import { DeliveryPriceCooperative } from './components/delivery-price-cooperative/delivery-price-cooperative';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-prices',
  imports: [
    SelectButtonModule,
    FormsModule,
    DeliveryPriceCounts,
    DeliveryPriceCity,
    DeliveryPriceCooperative
  ],
  templateUrl: './delivery-prices.html',
  styleUrl: './delivery-prices.css',
})
export class DeliveryPrices {
  protected selected: number = 1;
}
