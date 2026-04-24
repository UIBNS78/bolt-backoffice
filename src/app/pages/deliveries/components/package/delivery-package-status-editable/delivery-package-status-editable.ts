import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, InputSignal, Output, signal, Signal, WritableSignal } from '@angular/core';
import { PackageStatusIconPipe } from '@shared/pipes/package-pipes/package-status-icon-pipe';
import { PackageStatusPipe } from '@shared/pipes/package-pipes/package-status-pipe';
import { PackageStatusSeverityPipe } from '@shared/pipes/package-pipes/package-status-severity-pipe';
import { Package, PACKAGE_STATUS, PackageStatus, packageTypeObj } from '@shared/types/package';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CooperativePackageInformation } from './cooperative-package-information/cooperative-package-information';

@Component({
  selector: 'app-delivery-package-status-editable',
  imports: [
    MenuModule,
    TagModule,
    NgClass,
    PackageStatusSeverityPipe,
    PackageStatusIconPipe,
    PackageStatusPipe,
    ProgressSpinnerModule,
    DialogModule,
    CooperativePackageInformation
  ],
  templateUrl: './delivery-package-status-editable.html',
  styleUrl: './delivery-package-status-editable.css',
})
export class DeliveryPackageStatusEditable {
  @Output() onStatusChangeEmitter: EventEmitter<PackageStatus> = new EventEmitter<PackageStatus>();
  
  package: InputSignal<Package> = input.required<Package>();
  protected openCooperativePackageInformation: WritableSignal<boolean> = signal(false);

  protected items: MenuItem[] = [
    {
      id: PACKAGE_STATUS.inProgress.toString(),
      label: 'En cours',
      icon: 'pi pi-bullseye',
      command: () => {
        this.handleStatusChange(PACKAGE_STATUS.inProgress);
      }
    },
    {
      id: PACKAGE_STATUS.delivered.toString(),
      label: 'Livrés',
      icon: 'pi pi-check',
      command: () => {
        if (this.package().type === packageTypeObj.outCity) {
          this.openCooperativePackageInformation.set(true);
        } else {
          this.handleStatusChange(PACKAGE_STATUS.delivered);
        }
      }
    },
    {
      id: PACKAGE_STATUS.reported.toString(),
      label: 'Reportés',
      icon: 'pi pi-refresh',
      command: () => {
        this.handleStatusChange(PACKAGE_STATUS.reported);
      }
    },
    {
      id: PACKAGE_STATUS.cancelled.toString(),
      label: 'Annulés',
      icon: 'pi pi-times',
      command: () => {
        this.handleStatusChange(PACKAGE_STATUS.cancelled);
      }
    }
  ];

  protected statuses: Signal<MenuItem[]> = computed(() => {
    return this.items.filter(s => s.id !== this.package().status.toString());
  });

  handleCloseCooperativePackageInformation(): void {
    this.openCooperativePackageInformation.set(false);
  }
  
  private handleStatusChange(newStatus: PackageStatus): void {
    if (newStatus === this.package().status) return;
    this.onStatusChangeEmitter.emit(newStatus);
  }
}
