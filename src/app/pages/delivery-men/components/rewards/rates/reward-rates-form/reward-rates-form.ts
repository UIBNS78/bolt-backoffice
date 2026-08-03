import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DmRewardRatesService } from 'app/pages/delivery-men/services/dm-reward-rates-service';
import { RewardRate } from 'app/pages/delivery-men/types/delivery-men-reward-rate';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { defer, EMPTY, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reward-rates-form',
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './reward-rates-form.html',
  styleUrl: './reward-rates-form.css',
})
export class RewardRatesForm implements OnInit, OnDestroy {
  // services
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly dmRewardRatesService: DmRewardRatesService = inject(DmRewardRatesService);
  private readonly messageService: MessageService = inject(MessageService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected selectedRewardRate: WritableSignal<RewardRate | null> = signal(null);
  protected loading: WritableSignal<boolean> = signal(false);

  constructor() {
    this.isUpdate.set(false);
    this.form = this.formBuilder.group({
      reward: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
      active: false,
    });
  }

  ngOnInit(): void {
    const rewardRate: RewardRate | null = this.dialogConfig.data?.rewardRate ?? null;
    if (!rewardRate) return;

    this.isUpdate.set(true);
    this.selectedRewardRate.set(rewardRate);
    this.form.patchValue({
      id: rewardRate.id,
      reward: rewardRate.reward,
      active: rewardRate.active
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const values = this.form.getRawValue() as RewardRate;
    defer(() => {
      if (this.isUpdate()) {
        if (!this.selectedRewardRate()) {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Tarif non trouvé."
          });
          return EMPTY;
        }

        return this.dmRewardRatesService.updateRewardRate(this.selectedRewardRate()!.id, values)
      }
      return this.dmRewardRatesService.createRewardRate(values)
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: (this.isUpdate() ? "Mise à jour" : "Enregistrement") + ' de la récompense réussi'
      });
      this.handleClose(true);
    });
  }

  handleClose(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }
}
