import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-amount-chart',
  imports: [
    FormsModule,
    SelectButtonModule,
    ChartModule,
    ButtonModule
  ],
  templateUrl: './dashboard-amount-chart.html',
  styleUrl: './dashboard-amount-chart.css',
})
export class DashboardAmountChart implements OnInit {
  protected state: WritableSignal<'week' | 'month' | 'year'> = signal('week');

  data: any;
  options: any;

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data = {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        datasets: [
            {
                label: 'Frais de livraison',
                backgroundColor: documentStyle.getPropertyValue('--p-blue-300'),
                borderColor: documentStyle.getPropertyValue('--p-blue-300'),
                data: [65, 59, 80, 81, 56, 55, 40, 20, 35, 45, 60, 15]
            },
        ]
    };

    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
              display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    }
  }
}
