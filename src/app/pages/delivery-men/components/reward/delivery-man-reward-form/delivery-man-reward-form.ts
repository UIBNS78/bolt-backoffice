import { Component, EventEmitter, inject, input, Input, InputSignal, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { PackageReward, PackageRewardForm } from 'app/pages/delivery-men/types/delivery-men-reward';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-delivery-man-reward-form',
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
  templateUrl: './delivery-man-reward-form.html',
  styleUrl: './delivery-man-reward-form.css',
})
export class DeliveryManRewardForm implements OnDestroy {
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected loading: WritableSignal<boolean> = signal(false);
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);

  // inputs / outputs
  @Output() onCloseEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() open: boolean = false;
  selectedReward: InputSignal<PackageReward | null> = input<PackageReward | null>(null);
  @Input() 
  set reward (data: PackageRewardForm | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      title: [data?.title ?? '', [Validators.required, Validators.minLength(3)]],
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
    this.onCloseEmitter.emit(refresh);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const values = this.form.getRawValue() as PackageRewardForm;
    
    const reward: PackageRewardForm = {
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
    console.log("Deleting...", this.selectedReward());
  }

  private createReward(reward: PackageRewardForm): void {
    this.deliveryMenService.createReward(reward).pipe(
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

  private updateReward(reward: PackageRewardForm): void {
    if (!this.selectedReward()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Récompense introuvable',
      });
      return;
    }

    this.deliveryMenService.updateReward(this.selectedReward()!.id, reward).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Salaire mis à jour avec succès',
      });
      this.handleClose(true);
    });
  }
}
