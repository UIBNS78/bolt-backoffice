import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DmRewardRatesList } from '../../components/rewards/rates/dm-reward-rates-list/dm-reward-rates-list';
import { DmRewardRatesHandler } from '../../components/rewards/rates/dm-reward-rates-handler/dm-reward-rates-handler';

@Component({
  selector: 'app-delivery-man-rates',
  imports: [
    FormsModule,
    SelectButtonModule,
    DmRewardRatesList,
    DmRewardRatesHandler
  ],
  templateUrl: './delivery-man-rates.html',
  styleUrl: './delivery-man-rates.css',
})
export class DeliveryManRates {
  protected selected: number = 1;
}
