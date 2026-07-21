import { Component, inject, Input, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { DeliveryManSalary } from 'app/pages/delivery-men/types/delivery-men-salary';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delivery-man-salaries-form',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    MessageModule,
    ButtonModule,
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
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.options;

  @Input()
  set salary(data: Partial<DeliveryManSalary | null>) {
    if (!data || !data.deliveryMan) return;
    
    this.isUpdate.set(true);
    this._form.patchValue({
      id: data.id,
      userId: data.deliveryMan.userId,
      amount: data.amount
    });
  }

  get form(): FormGroup {
    return this._form;
  }
  
  constructor() {
    this._form = this.formBuilder.group({
      userId: [null, Validators.required],
      amount: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]]
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

    this.handleClose(true);
  }

  handleClose(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }
}
