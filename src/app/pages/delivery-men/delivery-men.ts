import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DeliveryMenList } from './types/delivery-men-list';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DeliveryMenService } from './delivery-men-service';
import { NgxMaskPipe } from 'ngx-mask';
import { DeliveryMan } from '@shared/types/delivery-men';
import { ChipModule } from 'primeng/chip';
import { DeliveryMenPlaceholder } from './components/delivery-men-placeholder/delivery-men-placeholder';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AgePipe } from '@shared/pipes/age.pipe';
import { ImageModule } from 'primeng/image';
import { SeniorityPipe } from '@shared/pipes/seniority.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { DeliveryManDetails } from './components/delivery-man-details/delivery-man-details';
import { DeliveryManForm } from './components/delivery-man-form/delivery-man-form';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';
import { TagModule } from 'primeng/tag';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SocketService } from 'core/services/socket-service';
import { SOCKET_EVENT } from '@shared/types/socket';
import { UserConnectivitySocketData } from '@shared/types/user';

@Component({
  selector: 'app-delivery-men',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    ChipModule,
    PluralPipe,
    NgxMaskPipe,
    DeliveryMenPlaceholder,
    SkeletonModule,
    DatePipe,
    AgePipe,
    SeniorityPipe,
    AvatarModule,
    TagModule,
    TooltipModule,
    NgClass,
    DeliveryManDetails,
    DeliveryManForm,
    ImageModule,
    CivilityPipe,
    BigramPipe,
    UpperCasePipe,
    OverlayBadgeModule
],
  templateUrl: './delivery-men.html',
  styleUrl: './delivery-men.css',
})
export class DeliveryMen implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // services
  private deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly socketService: SocketService = inject(SocketService);
  // vars
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected acitveCounts: WritableSignal<number> = signal(0);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected showForm: WritableSignal<boolean> = signal(false);
  protected showDetails: WritableSignal<boolean> = signal(false);
  protected selectedDeliveryManId: WritableSignal<number | null> = signal(null);
  protected selectedDeliveryManEdit: WritableSignal<DeliveryMan | null> = signal(null);
  protected data: WritableSignal<DeliveryMenList> = signal({
    deliveryMen: [],
    totalItems: 0
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
    
    // socket listenner
    this.socketListenner();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.deliveryMenService.getAll({ page: this.first() / this.rows() + 1, itemsPerPage: this.rows()}).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((response: DeliveryMenList) => {
      this.data.set(response);   
      this.countActive();
    });
  }
  
  handleOpenForm(deliveryMan: DeliveryMan | null = null): void {
    this.selectedDeliveryManEdit.set(deliveryMan);
    this.showForm.update(prev => {
      if (prev) {
        this.loadData();
      }

      return !prev;
    });
  }

  handleOpenDetails(deliveryManId: number | null = null): void {
    this.selectedDeliveryManId.set(deliveryManId);
    this.showDetails.update(prev => !prev);
  }

  handleDelete(man: DeliveryMan): void {
    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Suppression",
        message: "Êtes-vous sûr de vouloir supprimer ce livreur ? cette action est irreversible.",
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
        man.isDeleting = true;
        this.deliveryMenService.delete(man.id).pipe(
          take(1),
          takeUntil(this.unsubscribe$),
          finalize(() => man.isDeleting = false)
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Suppression réussie',
            detail: 'Le livreur a été supprimé avec succès.'
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

  private countActive(): void {
    this.acitveCounts.set(this.data().deliveryMen.filter(d => d.isOnline).length);
  }

  private socketListenner(): void {
    // auto refresh data on man is online/offline
    this.socketService.onEvent(SOCKET_EVENT.userConnectivity, ({ userId, isOnline }: UserConnectivitySocketData) => {
      this.data.update(data => {
        const index = data.deliveryMen.findIndex(d => d.userId === userId);
        if (index !== -1) {
          data.deliveryMen[index].isOnline = isOnline;
        }
        return { ...data };
      })        
    })
  }
}
