import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { OwnerList } from './types/owner-list';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { OwnersService } from './owners-service';
import { OwnersCount } from './types/owners-count';
import { planObj } from '@shared/types/owner-plan';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { NgxMaskPipe } from 'ngx-mask';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { OwnersPlaceholder } from './components/owners-placeholder/owners-placeholder';
import { Owner } from '@shared/types/owner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';
import { MessageService } from 'primeng/api';
import { OwnerForm } from './components/owner-form/owner-form';

@Component({
  selector: 'app-owners',
  imports: [
    PaginatorModule,
    TableModule,
    TodayYesterdayTomorrowPipe,
    ButtonModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ChipModule,
    NgxMaskPipe,
    PluralPipe,
    SkeletonModule,
    OwnersPlaceholder,
    OwnerForm
  ],
  templateUrl: './owners.html',
  styleUrl: './owners.css',
})
export class Owners implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  // services
  private ownersService: OwnersService = inject(OwnersService);
  protected dialogService: DialogService = inject(DialogService);
  protected messageService: MessageService = inject(MessageService);
  // vars
  protected showForm: WritableSignal<boolean> = signal(false);
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected data: WritableSignal<OwnerList> = signal({
    owners: [],
    totalItems: 0
  });
  protected counts: WritableSignal<OwnersCount> = signal({
    ownersCount: 0,
    premiumCount: 0,
    simpleCount: 0
  });
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected isCreating: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.ownersService.getAll({ page: this.first() / this.rows() + 1, itemsPerPage: this.rows()}).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((response: OwnerList) => {
      this.data.set(response);
      this.countOwners();
    });
  }

  handleOpenForm(): void {
    this.showForm.update(prev => {
      if (prev) {
        this.loadData();
        return false;
      }
      
      return true;
    });
  }

  handleDelete(owner: Owner): void {
    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Suppression",
        message: "Êtes-vous sûr de vouloir supprimer ce propriétaire ? cette action est irreversible.",
        icon: "pi pi-trash",
        acceptLabel: "Oui, supprimer",
      },
      modal: true,
      draggable: false,
      resizable: false
    });
    
    modalRef?.onClose.pipe(
      take(1),
      takeUntil(this.unsubscribe$),
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        owner.isDeleting = true;
        this.ownersService.delete(owner.id).pipe(
          take(1),
          takeUntil(this.unsubscribe$),
          finalize(() => owner.isDeleting = false)
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Suppression réussie',
            detail: 'Le propriétaire a été supprimé avec succès.'
          });
          this.loadData();
        });
      }
    })
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  private countOwners(): void {
    this.counts.set({
      ownersCount: this.data().owners.length,
      premiumCount: this.data().owners.filter(o => o.planId === planObj.premium).length,
      simpleCount: this.data().owners.filter(o => o.planId === planObj.simple).length,
    });
  }
}
