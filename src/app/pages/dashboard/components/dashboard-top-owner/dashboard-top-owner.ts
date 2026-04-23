import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-dashboard-top-owner',
  imports: [
    ChartModule,
    AvatarModule,
    OverlayBadgeModule
  ],
  templateUrl: './dashboard-top-owner.html',
  styleUrl: './dashboard-top-owner.css',
})
export class DashboardTopOwner implements OnInit {
  data: any;
  options: any;

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.data = {
        labels: ['Rabary Lodge', 'USA Shirt', 'Mikata'],
        datasets: [
            {
                data: [3000000, 700000, 100000],
                backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')],
            }
        ]
    };

    this.options = {
        cutout: '70%',
        plugins: {
            legend: {
              display: false
            }
        }
    };
  }
}
