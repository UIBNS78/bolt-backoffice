import { Component, inject, Input, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { DeliveryManSalary, DeliveryManSalaryForm } from 'app/pages/delivery-men/types/delivery-men-salary';
import { addMonths, format, startOfMonth } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delivery-man-salaries-form',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    MessageModule,
    ButtonModule,
    DatePickerModule,
  ],
  templateUrl: './delivery-man-salaries-form.html',
  styleUrl: './delivery-man-salaries-form.css',
})
export class DeliveryManSalariesForm implements OnDestroy {
  // services
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected readonly minDate: Date = startOfMonth(addMonths(new Date(), 1));
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.deliveryMenAsUsersOptions;

  @Input()
  set salary(data: DeliveryManSalary | null) {
    if (!data) return;
    
    this.isUpdate.set(true);
    this._form.patchValue({
      id: data.id,
      userId: data.deliveryMan.userId,
      amount: data.amount,
      applyAt: new Date(data.applyAt)
    });
  }

  get form(): FormGroup {
    return this._form;
  }
  
  constructor() {
    this._form = this.formBuilder.group({
      userId: [null, Validators.required],
      amount: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
      applyAt: [format(startOfMonth(addMonths(new Date(), 1)), "dd MMMM yyyy"), [Validators.required]],
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
    const values = this.form.getRawValue() as DeliveryManSalaryForm;
    const applyAt: Date = new Date(values.applyAt);
    applyAt.setHours(23, 59, 59, 999);
    
    const salary: DeliveryManSalaryForm = {
      userId: values.userId,
      amount: values.amount,
      applyAt,
    }
    this.deliveryMenService.createSalary(salary).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.handleClose(true);
    });
  }

  handleClose(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }
}
