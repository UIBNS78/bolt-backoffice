import { Component, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PACKAGE_STATUS } from '@shared/types/package';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-delivery-package-cancel-form',
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    DialogModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './delivery-package-cancel-form.html',
  styleUrl: './delivery-package-cancel-form.css',
})
export class DeliveryPackageCancelForm {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  // vars
  visible: InputSignal<boolean> = input(false);
  submitEmitter: OutputEmitterRef<FormData> = output<FormData>();
  closeEmitter: OutputEmitterRef<void> = output<void>();

  protected form: FormGroup = new FormGroup({});
  protected defaultReason: string[] = [
    "Décision du client",
    "Client injoignable",
    "Colis endommagé",
    "Colis incomplet",
    "Décision du propriétaire",
  ];
  protected reasonOptions: WritableSignal<string[]> = signal(this.defaultReason);

  constructor() {
    this.form = this.formBuilder.group({
      cancelReason: ['', [Validators.required, Validators.minLength(3), Validators.max(30)]]
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const formData: FormData = new FormData();
    formData.append("status", PACKAGE_STATUS.cancelled.toString());
    formData.append("cancelReason", this.form.get("cancelReason")?.value as string);
    this.submitEmitter.emit(formData);
  }

  searchReason(event: AutoCompleteCompleteEvent): void {
    if (!event.query || event.query.length <= 0) {
      this.reasonOptions.set([...this.defaultReason]);
    } else {
      this.reasonOptions.set(this.defaultReason.filter(option => option.includes(event.query)));
    }
  }

  handleClose(): void {
    this.closeEmitter.emit();
  }
}
