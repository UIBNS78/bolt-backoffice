import { Component, EventEmitter, inject, Input, input, InputSignal, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { Subject } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { Package } from '@shared/types/package';

@Component({
  selector: 'app-delivery-package-form',
  imports: [
    DrawerModule
  ],
  templateUrl: './delivery-package-form.html',
  styleUrl: './delivery-package-form.css',
})
export class DeliveryPackageForm implements OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set pkg(data: Partial<Package> | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      // id: data?.id ?? null,
      // name: [data?.name ?? '', [Validators.required, Validators.minLength(3)]],
      // firstName: [data?.firstName ?? '', [Validators.required, Validators.minLength(3)]],
      // birthday: [data?.birthday ?? '', [Validators.required]],
      // phone: [data?.phone ?? '', [Validators.required]],
      // address: [data?.address ?? '', [Validators.required, Validators.minLength(3)]],
      // password: [{ value: data !== null ? '' : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      // totalPackages: [data?.totalPackages ?? 0, [Validators.pattern("[0-9]*"), Validators.min(0)]],
      // transport: [data?.transport ?? 1, [Validators.required, Validators.max(3)]]
    });
  };
  get form(): FormGroup {
    return this._form;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleClose(): void {
    this.form.reset();
    this.onCloseEmitter.emit();
  }
}
