import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DeliveryManRewardHandler } from './delivery-man-reward-handler/delivery-man-reward-handler';
import { DeliveryMenRewardsList } from './delivery-men-rewards-list/delivery-men-rewards-list';

@Component({
  selector: 'app-delivery-man-rewards',
  imports: [
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    DeliveryMenRewardsList,
    DeliveryManRewardHandler
  ],
  templateUrl: './delivery-man-rewards.html',
  styleUrl: './delivery-man-rewards.css',
})
export class DeliveryManRewards {
  protected selected: number = 1;
}
