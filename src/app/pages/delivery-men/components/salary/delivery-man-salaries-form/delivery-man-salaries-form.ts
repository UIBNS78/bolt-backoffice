import { Component, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { DmService as DeliveryMenService } from 'app/pages/delivery-men/services/dm-service';
import { DmSalariesService } from 'app/pages/delivery-men/services/dm-salaries-service';
import { DeliveryManSalary, DeliveryManSalaryForm } from 'app/pages/delivery-men/types/delivery-men-salary';
import { eachDayOfInterval, isFirstDayOfMonth, isSunday, isThisMonth, lastDayOfMonth, startOfMonth, subDays } from 'date-fns';
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
  private readonly dmSalariesService: DmSalariesService = inject(DmSalariesService);
  private readonly messageService: MessageService = inject(MessageService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected readonly minDate: Date = subDays(new Date(), 1);
  protected form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected selectedSalary: WritableSignal<DeliveryManSalary | null> = signal(null);
  protected loading: WritableSignal<boolean> = signal(false);
  protected isThisMonth: WritableSignal<boolean> = signal(true);
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.deliveryMenAsUsersOptions;

  get proratedAmountValue(): number {
    return this.form.get("proratedAmount")?.value ?? 0;
  }
  
  constructor() {
    this.isUpdate.set(false);
    this.form = this.formBuilder.group({
      userId: [null, Validators.required],
      amount: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
      applyAt: [this.minDate, [Validators.required]],
      proratedAmount: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
    });
  }
  
  ngOnInit(): void {
    this.amountListener();
    this.applyAtListener();
    
    const salary: DeliveryManSalary | null = this.dialogConfig.data?.salary ?? null;
    if (!salary) return;

    this.isUpdate.set(true);
    this.selectedSalary.set(salary);
    this.form.patchValue({
      id: salary.id,
      userId: salary.deliveryMan.userId,
      amount: salary.amount,
      applyAt: new Date(salary.applyAt),
      proratedAmount: salary.proratedAmount
    });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      console.log(this.form.get("proratedAmount")?.errors)
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
      proratedAmount: values.proratedAmount
    }
    console.log(salary)
    if (this.isUpdate()) {
      this.updateSalary(salary);
    } else {
      this.createSalary(salary);
    }
  }

  handleClose(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }

  private amountListener(): void {
    this.form.get("amount")?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      if (!isThisMonth(this.form.get("applyAt")?.value)) {
        this.form.get("proratedAmount")?.setValue(0);
        return;
      }

      const proratedAmount: number = this.getProratedAmount(this.form.get("applyAt")?.value);
      this.form.get("proratedAmount")?.setValue(proratedAmount);
    });
  }
  
  private applyAtListener(): void {
    this.form.get("applyAt")?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((value: Date) => {
      this.isThisMonth.set(isThisMonth(value));

      if (!isThisMonth(value)) {
        this.form.get("proratedAmount")?.setValue(0);
        return;
      }

      const proratedAmount: number = this.getProratedAmount(value);
      this.form.get("proratedAmount")?.setValue(proratedAmount);
    });
  }
  
  private createSalary(salary: DeliveryManSalaryForm): void {
    this.dmSalariesService.createSalary(salary).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Salaire créé avec succès',
      });
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

    this.dmSalariesService.updateSalary(this.selectedSalary()!.id, salary).pipe(
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

  private getProratedAmount(startDate: Date): number {
    let prorated: number = 0;
    const endDate = lastDayOfMonth(startDate);
    const allDaysWithoutSundaysWithStartDate: number = eachDayOfInterval({ start: startDate, end: endDate }).filter(day => !isSunday(day)).length;
    const allDaysWithoutSundays: number = eachDayOfInterval({ start: startOfMonth(startDate), end: endDate }).filter(day => !isSunday(day)).length;
    prorated = (allDaysWithoutSundaysWithStartDate * (this.form.get("amount")?.value ?? 0)) / allDaysWithoutSundays;
    return Math.round(prorated);
  }
}
