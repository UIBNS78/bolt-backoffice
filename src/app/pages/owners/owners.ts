import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
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
    NgxMaskPipe
  ],
  templateUrl: './owners.html',
  styleUrl: './owners.css',
})
export class Owners implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  // services
  private ownersService: OwnersService = inject(OwnersService);
  // vars
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
