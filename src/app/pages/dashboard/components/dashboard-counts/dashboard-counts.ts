import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard-counts',
  imports: [
    CardModule
  ],
  templateUrl: './dashboard-counts.html',
  styleUrl: './dashboard-counts.css',
})
export class DashboardCounts {}
