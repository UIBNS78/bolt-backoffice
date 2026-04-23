import { Component } from '@angular/core';
import { DashboardAmountChart } from './components/dashboard-amount-chart/dashboard-amount-chart';
import { DashboardCounts } from './components/dashboard-counts/dashboard-counts';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardAmountChart,
    DashboardCounts
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
