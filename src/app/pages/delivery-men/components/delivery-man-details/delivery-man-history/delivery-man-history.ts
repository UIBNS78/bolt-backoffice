import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { PACKAGE_STATUS } from '@shared/types/package';
import { AvatarModule } from 'primeng/avatar';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-man-history',
  imports: [
    PanelModule,
    TimelineModule,
    AvatarModule,
    Tooltip,
    NgClass
  ],
  templateUrl: './delivery-man-history.html',
  styleUrl: './delivery-man-history.css',
})
export class DeliveryManHistory {
  events15: any[] = [
    { customer: 'Mme Rachida', location: "Mahamasina", status: PACKAGE_STATUS.delivered, date: '15/10/2020 10:30' },
    { customer: 'Mr Live', location: "Tsimbazaza", status: PACKAGE_STATUS.cancelled, date: '15/10/2020 14:00' },
    { customer: 'Mme Henika', location: "Alasora", status: PACKAGE_STATUS.delivered, date: '15/10/2020 16:15' },
  ];
  events16: any[] = [
    { customer: 'Mme Jennifer', location: "Bypass", status: PACKAGE_STATUS.reported, date: '16/10/2020 10:00' }
  ];
}
