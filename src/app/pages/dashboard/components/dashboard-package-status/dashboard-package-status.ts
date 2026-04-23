import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MeterGroupModule } from 'primeng/metergroup';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dashboard-package-status',
  imports: [
    ButtonModule,
    MeterGroupModule,
    NgClass,
    TooltipModule
  ],
  templateUrl: './dashboard-package-status.html',
  styleUrl: './dashboard-package-status.css',
})
export class DashboardPackageStatus {
  packages = [
    { label: 'Livrés', color: '#34d399', value: 45, icon: 'pi pi-check' },
    { label: 'En attentes', color: '#fbbf24', value: 25, icon: 'pi pi-bullseye' },
    { label: 'Reportés', color: '#60a5fa', value: 20, icon: 'pi pi-refresh' },
    { label: 'Annulés', color: '#f87171', value: 10, icon: 'pi pi-times' }
  ];
}
