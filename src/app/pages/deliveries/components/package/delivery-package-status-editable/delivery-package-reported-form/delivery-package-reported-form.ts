import { Component, EventEmitter, inject, Input, input, InputSignal, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PACKAGE_STATUS } from '@shared/types/package';
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
    DatePickerModule
  ],
  templateUrl: './delivery-package-reported-form.html',
  styleUrl: './delivery-package-reported-form.css',
})
export class DeliveryPackageReportedForm {
  private formBuilder: FormBuilder = inject(FormBuilder);

  @Output() closeEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitEmitter: EventEmitter<FormData> = new EventEmitter<FormData>();
  visible: InputSignal<boolean> = input.required<boolean>();
  protected form: FormGroup = new FormGroup({});

  constructor() {
    this.form = this.formBuilder.group({
      reportedAt: null
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
    this.submitEmitter.emit(formData);
  }
  
  handleClose(): void {
    this.closeEmitter.emit();
  }
}
