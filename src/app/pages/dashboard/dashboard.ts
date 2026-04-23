import { Component } from '@angular/core';
import { DashboardAmountChart } from './components/dashboard-amount-chart/dashboard-amount-chart';
import { DashboardCounts } from './components/dashboard-counts/dashboard-counts';
import { DashboardPackageStatus } from './components/dashboard-package-status/dashboard-package-status';
import { DashboardTopOwner } from './components/dashboard-top-owner/dashboard-top-owner';
import { DashboardDeliveryMenPerf } from './components/dashboard-delivery-men-perf/dashboard-delivery-men-perf';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardAmountChart,
    DashboardCounts,
    DashboardPackageStatus,
    DashboardTopOwner,
    DashboardDeliveryMenPerf
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
