import { Component, computed, effect, EventEmitter, inject, input, InputSignal, OnDestroy, Output, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { Package, PackageStatus } from '@shared/types/package';
import { DeliveriesService } from 'app/pages/deliveries/deliveries-service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, finalize, Subject, take, takeUntil } from 'rxjs';
import { DeliveryPackagesPlaceholder } from '../delivery-packages-placeholder/delivery-packages-placeholder';
import { TableModule } from 'primeng/table';
import { NgxMaskPipe } from 'ngx-mask';
import { TagModule } from 'primeng/tag';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeliveryPackageFilterButton } from '../delivery-package-filter-button/delivery-package-filter-button';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';
import { DeliveryPackageStatusEditable } from '../delivery-package-status-editable/delivery-package-status-editable';
import { DividerModule } from 'primeng/divider';
import { DeliveryPackageForm } from '../delivery-package-form/delivery-package-form';
import { DeliveryFormDrawer } from '../../delivery/delivery-form-drawer/delivery-form-drawer';
import { NgClass } from '@angular/common';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { Delivery } from '@shared/types/delivery';
import { PackageActivities } from '../package-activities/package-activities';
import { DeliveryDetailsDrawer } from '../../delivery/delivery-details-drawer/delivery-details-drawer';
import { ActivatedRoute } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';

@Component({
  selector: 'app-delivery-packages-list',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    DeliveryPackagesPlaceholder,
    TableModule,
    NgxMaskPipe,
    TagModule,
    ReactiveFormsModule,
    DeliveryPackageFilterButton,
    DeliveryPackageStatusEditable,
    DividerModule,
    DeliveryPackageForm,
    DeliveryFormDrawer,
    NgClass,
    CivilityPipe,
    PackageActivities,
    DeliveryDetailsDrawer,
    ImageModule,
    PluralPipe,
    TodayYesterdayTomorrowPipe
  ],
  templateUrl: './delivery-packages-list.html',
  styleUrl: './delivery-packages-list.css',
})
export class DeliveryPackagesList implements OnDestroy {
  // services
  private readonly deliveriesService: DeliveriesService = inject(DeliveriesService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // vars
  protected editableStatus: Signal<DeliveryPackageStatusEditable | undefined> = viewChild(DeliveryPackageStatusEditable);
  @Output() loadDeliveryEmitter: EventEmitter<void> = new EventEmitter<void>();
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected flashingPackageId: WritableSignal<number | null> = signal<number | null>(null);
  protected showPackageForm: WritableSignal<boolean> = signal(false);
  protected showPackageActivity: WritableSignal<boolean> = signal(false);
  protected showDeliveryForm: WritableSignal<boolean> = signal(false);
  protected showDeliveryDetails: WritableSignal<boolean> = signal(false);
  protected selectedPackage: WritableSignal<Package | null> = signal(null);
  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  protected hasFilter: WritableSignal<boolean> = signal(false);
  delivery: InputSignal<Delivery | null> = input<Delivery | null>(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected packages: WritableSignal<Package[]> = signal([]);
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  protected filteredPackages: Signal<Package[]> = computed(() => {
    if (this.searchValue() === "") return this.packages();

    return this.packages().filter(p => {
      return p.customer.name.toLowerCase().includes(this.searchValue().toLowerCase()) 
        || p.deliveryMan.firstName.toLowerCase().includes(this.searchValue().toLowerCase())
        || p.customer.inCity?.place.name.toLowerCase().includes(this.searchValue().toLowerCase())
    });
  });

  constructor() {
    effect(() => {
      if (!this.delivery()?.id) {
        this.isLoading.set(false);
        this.packages.set([]);
        this.searchControl.disable();
        return;
      }

      this.isLoading.set(true);
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliveriesService.getPackagesByOwnersByDeliveryId(this.delivery()!.id).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(packages => {
      if (packages.length > 0) this.searchControl.enable();
      else this.searchControl.disable();

      this.hasFilter.set(false);
      this.packages.set(packages);
      this.triggerFlash();
    });
  }

  handleOpenDeliveryForm(isCancel: boolean = false): void {
    this.showDeliveryForm.update(prev => {
      if (prev && !isCancel) {
        this.loadDeliveryEmitter.emit();
      }
      
      return !prev;
    });
  }

  handleOpenDeliveryDetails(): void {
    this.showDeliveryDetails.update(prev => !prev);
  }

  handleOpenPackageForm(pkg: Package | null = null, isCancel: boolean = false): void {
    this.selectedPackage.set(pkg);
    this.showPackageForm.update(prev => {
      if (prev && !isCancel) {
        this.loadData();
        this.loadDeliveryEmitter.emit();
      };

      return !prev;
    });
  }

  handleOpenPackageActivity(pkg: Package | null = null): void {
    this.selectedPackage.set(pkg);
    this.showPackageActivity.update(prev => !prev);
  }

  handleFilterByStatus(status: PackageStatus): void {
    const packages: Package[] = this.packages().filter(p => p.status === status);
    if (packages.length <= 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Aucun colis',
        detail: 'Aucun colis ne correspond à ce statut.',
        life: 5000
      });
      this.hasFilter.set(false);
      return;
    }

      this.hasFilter.set(true);
    this.packages.set(packages);
  }

  handleFilterByFragility(fragility: boolean): void {
    const packages: Package[] = this.packages().filter(p => p.isFragile === fragility);
    if (packages.length <= 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Aucun colis',
        detail: 'Aucun colis ne correspond à ce critère de fragilité.',
        life: 5000
      });
      this.hasFilter.set(false);
      return;
    }

    this.hasFilter.set(true);
    this.packages.set(packages);
  }

  handlePackageStatus(formData: FormData, pkg: Package): void {
    pkg.isStatusChanging = true;
    this.deliveriesService.updatePackageStatus(pkg.id, formData).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => pkg.isStatusChanging = false)
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Statut mis à jour',
        detail: 'Le statut du colis a été mis à jour avec succès.'
      });

      this.loadData();
    });
  }

  handleDelete(pkg: Package): void {
    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Suppression",
        message: "Êtes-vous sûr de vouloir supprimer ce colis de cette livraison ? cette action est irreversible.",
        icon: "pi pi-trash",
        acceptLabel: "Oui, supprimer",
      },
      showHeader: false,
      modal: true,
      draggable: false,
      resizable: false
    });

    modalRef?.onClose.pipe(
      take(1),
      takeUntil(this.unsubscribe$),
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        pkg.isDeleting = true;
        this.deliveriesService.deletePackage(pkg.id).pipe(
          take(1),
          takeUntil(this.unsubscribe$),
          finalize(() => pkg.isDeleting = false)
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Suppression réussie',
            detail: 'Le colis a été supprimé avec succès.'
          });
          
          this.loadData();
        });
      }
    });
  }

  handleOpenReportedDateDialog(): void {
    this.editableStatus()!.handleOpenReportedForm();
  }

  private triggerFlash() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["package"]) {
        const packageId: number = parseInt(params["package"]!, 10);

        // check package id
        if (Number.isNaN(packageId)) {
          return;
        }

        this.flashingPackageId.set(packageId);
        
        // remove class after animation (2s)
        setTimeout(() => {
          if (this.flashingPackageId() === packageId) {
            this.flashingPackageId.set(null);
          }
        }, 2000);
      }
    });
  }
}
