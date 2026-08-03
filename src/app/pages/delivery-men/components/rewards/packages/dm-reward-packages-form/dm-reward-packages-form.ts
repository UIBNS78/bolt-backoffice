import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RewardPackage, RewardPackageForm } from 'app/pages/delivery-men/types/delivery-men-reward-package';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { DmRewardPackagesService } from 'app/pages/delivery-men/services/dm-reward-packages-service';

@Component({
  selector: 'app-dm-reward-packages-form',
  imports: [
    ReactiveFormsModule,
    DrawerModule,
    FieldsetModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    MessageModule,
    ButtonModule
  ],
  templateUrl: './dm-reward-packages-form.html',
  styleUrl: './dm-reward-packages-form.css',
})
export class DmRewardPackagesForm implements OnDestroy {
  // services
  private readonly dmRewardPackagesService: DmRewardPackagesService = inject(DmRewardPackagesService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected loading: WritableSignal<boolean> = signal(false);
  protected deleting: WritableSignal<boolean> = signal(false);
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);

  // inputs / outputs
  @Output() onCloseEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() open: boolean = false;
  selectedReward: WritableSignal<RewardPackage | null> = signal(null);
  @Input() 
  set reward (data: RewardPackage | null) {
    this.isUpdate.set(data !== null);
    this.selectedReward.set(data);

    this._form = this.formBuilder.group({
      title: [data?.title ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      motivation: [data?.motivation ?? '', [Validators.required, Validators.minLength(10)]],
      minPackages: [data?.minPackages ?? 1, [Validators.required, Validators.min(1)]],
      reward: [data?.reward ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  get form(): FormGroup {
    return this._form;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleClose(refresh: boolean = false): void {
    this._form.reset();
    this.selectedReward.set(null);
    this.onCloseEmitter.emit(refresh);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue() as RewardPackageForm;
    
    const reward: RewardPackageForm = {
      title: values.title,
      motivation: values.motivation,
      minPackages: values.minPackages,
      reward: values.reward,
    }
    if (this.isUpdate()) {
      this.updateReward(reward);
    } else {
      this.createReward(reward);
    }
  }

  handleDelete(): void {
    if (!this.selectedReward()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Récompense introuvable',
      });
      return;
    }

    if (this.selectedReward()!.active) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Impossible de supprimer cette récompense car elle est active en ce moment.',
      });
      return;
    }

    this.deleting.set(true);
    this.dmRewardPackagesService.deleteReward(this.selectedReward()!.id).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.deleting.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Récompense supprimée avec succès',
      });
      this.handleClose(true);
    });
  }

  private createReward(reward: RewardPackageForm): void {
    this.loading.set(true);
    this.dmRewardPackagesService.createReward(reward).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Récompense créé avec succès',
      });
      this.handleClose(true);
    });
  }

  private updateReward(reward: RewardPackageForm): void {
    if (!this.selectedReward()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Récompense introuvable',
      });
      return;
    }

    if (this.selectedReward()!.active) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Une récompense active ne peut pas être modifiée. Veuillez la désactiver avant de la modifier.',
      });
      return;
    }

    this.loading.set(true);
    this.dmRewardPackagesService.updateReward(this.selectedReward()!.id, reward).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Récompense mise à jour avec succès',
      });
      this.handleClose(true);
    });
  }
}
