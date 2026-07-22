import { Component, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { DeliveryManSalary, DeliveryManSalaryForm } from 'app/pages/delivery-men/types/delivery-men-salary';
import { addMonths, format, startOfMonth } from 'date-fns';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    AvatarModule,
    BigramPipe,
    CivilityPipe
  ],
  templateUrl: './delivery-man-salaries-form.html',
  styleUrl: './delivery-man-salaries-form.css',
})
export class DeliveryManSalariesForm implements OnInit, OnDestroy {
  // services
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly messageService: MessageService = inject(MessageService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected readonly minDate: Date = startOfMonth(addMonths(new Date(), 1));
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected selectedSalary: WritableSignal<DeliveryManSalary | null> = signal(null);
  protected loading: WritableSignal<boolean> = signal(false);
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.deliveryMenAsUsersOptions;

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
  
  ngOnInit(): void {
    const salary: DeliveryManSalary | null = this.dialogConfig.data?.salary ?? null;
    if (!salary) return;

    this.isUpdate.set(true);
    this.selectedSalary.set(salary);
    this._form.patchValue({
      id: salary.id,
      userId: salary.deliveryMan.userId,
      amount: salary.amount,
      applyAt: new Date(salary.applyAt)
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
    if (this.isUpdate()) {
      this.updateSalary(salary);
    } else {
      this.createSalary(salary);
    }
  }

  handleClose(refresh: boolean = false): void {
    this.isUpdate.set(false);
    this.dialogRef.close(refresh);
  }

  private createSalary(salary: DeliveryManSalaryForm): void {
    this.deliveryMenService.createSalary(salary).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.handleClose(true);
    });
  }

  private updateSalary(salary: DeliveryManSalaryForm): void {
    if (!this.selectedSalary()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Salaire introuvable',
      });
      return;
    }

    this.deliveryMenService.updateSalary(this.selectedSalary()!.id, salary).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.handleClose(true);
    });
  }
}
