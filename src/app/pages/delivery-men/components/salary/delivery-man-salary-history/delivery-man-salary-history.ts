import { Component, effect, EventEmitter, inject, Input, input, InputSignal, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { DeliveryManSalary } from 'app/pages/delivery-men/types/delivery-men-salary';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TimelineModule } from 'primeng/timeline';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { CivilityPipe } from '@shared/pipes/civility-pipe';

@Component({
  selector: 'app-delivery-man-salary-history',
  imports: [
    DrawerModule,
    TimelineModule,
    ButtonModule,
    DatePipe,
    NgClass,
    CivilityPipe,
    FieldsetModule,
    AvatarModule,
    UpperCasePipe
  ],
  templateUrl: './delivery-man-salary-history.html',
  styleUrl: './delivery-man-salary-history.css',
})
export class DeliveryManSalaryHistory implements OnDestroy {
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly messageService: MessageService = inject(MessageService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected loading: WritableSignal<boolean> = signal(false);
  protected history: WritableSignal<DeliveryManSalary[]> = signal([]);
  
  // inputs & output
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  visible: InputSignal<boolean> = input.required();
  salary: InputSignal<DeliveryManSalary | null> = input<DeliveryManSalary | null>(null);

  constructor() {
    effect(() => {
      if (!this.visible()) return;

      this.loadHistory();
    });
  }

  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isApplied(applyAt: Date): boolean {
    return new Date(applyAt).getTime() < new Date().getTime();
  }

  private loadHistory(): void {
    if (!this.salary()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Historique des salaires introuvable',
      });
      return;
    }

    const salary: DeliveryManSalary = this.salary()!;
    this.loading.set(true);
    this.deliveryMenService.getDeliveryManSalaryHistory(salary.deliveryMan.userId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe((response: DeliveryManSalary[]) => {
      this.history.set(response);
    });
  }

  protected handleClose(): void {
    this.onClose.emit();
  }
}
