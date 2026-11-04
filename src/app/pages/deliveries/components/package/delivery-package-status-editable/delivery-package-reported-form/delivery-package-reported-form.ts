import { Component, EventEmitter, inject, Input, input, InputSignal, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PACKAGE_STATUS } from '@shared/types/package';
import { addDays } from 'date-fns';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-delivery-package-reported-form',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    DatePickerModule,
    AutoCompleteModule
  ],
  templateUrl: './delivery-package-reported-form.html',
  styleUrl: './delivery-package-reported-form.css',
})
export class DeliveryPackageReportedForm {
  // vars
  @Output() closeEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitEmitter: EventEmitter<FormData> = new EventEmitter<FormData>();
  visible: InputSignal<boolean> = input.required<boolean>();
  
  private formBuilder: FormBuilder = inject(FormBuilder);
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
      reportedAt: [addDays(new Date(), 1), [Validators.required]],
      reportedReason: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    formData.append("status", PACKAGE_STATUS.reported.toString());
    formData.append("reportedAt", new Date(this.form.get("reportedAt")?.value).toISOString());
    formData.append("reportedReason", this.form.get("reportedReason")?.value as string);
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
