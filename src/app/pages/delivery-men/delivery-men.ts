import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DeliveryMenList } from './types/delivery-men-list';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DeliveryMenService } from './delivery-men-service';
import { NgxMaskPipe } from 'ngx-mask';
import { DeliveryMan } from '@shared/types/delivery-men';
import { ChipModule } from 'primeng/chip';
import { DeliveryMenPlaceholder } from './components/delivery-men-placeholder/delivery-men-placeholder';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AgePipe } from '@shared/pipes/age.pipe';
import { BadgeModule } from 'primeng/badge';
import { SeniorityPipe } from '@shared/pipes/seniority.pipe';
import { TooltipModule } from 'primeng/tooltip';

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
    BadgeModule,
    TooltipModule
  ],
  templateUrl: './delivery-men.html',
  styleUrl: './delivery-men.css',
})
export class DeliveryMen implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // services
  private deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  protected dialogService: DialogService = inject(DialogService);
  protected messageService: MessageService = inject(MessageService);
  // vars
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected acitveCounts: WritableSignal<number> = signal(0);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected showForm: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryMenList> = signal({
    deliveryMen: [],
    totalItems: 0
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
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
  
  handleOpenForm(): void {}

  handleEdit(deliveryMan: DeliveryMan): void {}

  handleOpenDetails(): void {}
  
  handleDelete(deliveryMan: DeliveryMan): void {}

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  private countActive(): void {
    this.acitveCounts.set(this.data().deliveryMen.filter(d => d.isActive).length);
  }
}
