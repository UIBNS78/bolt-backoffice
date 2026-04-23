import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard-delivery-men-perf',
  imports: [
    TableModule,
    FormsModule,
    TagModule
  ],
  templateUrl: './dashboard-delivery-men-perf.html',
  styleUrl: './dashboard-delivery-men-perf.css',
})
export class DashboardDeliveryMenPerf {
  deliveryMenPerf = [
    {
      name: 'Jean Dupont',
      packages: {
        total: 145,
        inProgress: 40,
        delivered: 100,
        reported: 0,
        cancelled: 5
      },
      payment: 120000
    },
    {
      name: 'Marie Martin',
      packages: {
        total: 95,
        inProgress: 10,
        delivered: 80,
        reported: 4,
        cancelled: 1
      },
      payment: 78000
    },
    {
      name: 'Pierre Durand',
      packages: {
        total: 45,
        inProgress: 15,
        delivered: 30,
        reported: 0,
        cancelled: 0
      },
      payment: 25000
    }
  ];

}
