import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DmRewardPackagesHandler } from '../../components/rewards/packages/dm-reward-packages-handler/dm-reward-packages-handler';
import { DmRewardPackagesList } from '../../components/rewards/packages/dm-reward-packages-list/dm-reward-packages-list';

@Component({
  selector: 'app-delivery-man-rewards',
  imports: [
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    DmRewardPackagesList,
    DmRewardPackagesHandler
  ],
  templateUrl: './delivery-man-rewards.html',
  styleUrl: './delivery-man-rewards.css',
})
export class DeliveryManRewards {
  protected selected: number = 1;
}
