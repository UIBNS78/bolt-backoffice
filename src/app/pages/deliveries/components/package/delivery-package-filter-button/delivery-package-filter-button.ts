import { Component, EventEmitter, input, InputSignal, Output, signal, WritableSignal } from '@angular/core';
import { PACKAGE_STATUS, PackageStatus } from '@shared/types/package';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-package-filter-button',
  imports: [
    ButtonModule,
    MenuModule,
    OverlayBadgeModule,
    TooltipModule
  ],
  templateUrl: './delivery-package-filter-button.html',
  styleUrl: './delivery-package-filter-button.css',
})
export class DeliveryPackageFilterButton {
  @Output() filterStatusEmitter: EventEmitter<PackageStatus> = new EventEmitter<PackageStatus>();
  @Output() filterFragilityEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clearFilterEmitter: EventEmitter<void> = new EventEmitter<void>();
  
  loading: InputSignal<boolean> = input<boolean>(false);
  hasPackages: InputSignal<boolean> = input<boolean>(false);
  hasFilter: InputSignal<boolean> = input<boolean>(false);
  protected items: MenuItem[] = [
    {
      label: 'Statut',
      items: [
        {
          label: 'En cours',
          icon: 'pi pi-bullseye',
          command: () => {
            this.filterStatusEmitter.emit(PACKAGE_STATUS.inProgress);
          }
        },
        {
          label: 'Livrés',
          icon: 'pi pi-check',
          command: () => {
            this.filterStatusEmitter.emit(PACKAGE_STATUS.delivered);
          }
        },
        {
          label: 'Reportés',
          icon: 'pi pi-refresh',
          command: () => {
            this.filterStatusEmitter.emit(PACKAGE_STATUS.reported);
          }
        },
        {
          label: 'Annulés',
          icon: 'pi pi-times',
          command: () => {
            this.filterStatusEmitter.emit(PACKAGE_STATUS.cancelled);
          }
        }
      ]
    },
    {
      label: "Fragilité",
      items: [
        {
          label: 'Oui',
          icon: 'pi pi-exclamation-triangle',
          command: () => {
            this.filterFragilityEmitter.emit(true);
          }
        },
        {
          label: 'Non',
          icon: 'pi pi-times-circle',
          command: () => {
            this.filterFragilityEmitter.emit(false);
          }
        }
      ]
    }
  ]

  handleClick(menu: Menu): void {
    if (!this.hasFilter()) {
      menu.toggle(new Event("click"));
      return;
    }

    // clear filter
    this.clearFilterEmitter.emit();
  }
}
