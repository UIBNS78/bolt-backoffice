import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { DeliveriesService } from '../../deliveries-service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Delivery } from '@shared/types/delivery';

@Component({
  selector: 'app-delivery-form-drawer',
  imports: [
    DrawerModule
  ],
  templateUrl: './delivery-form-drawer.html',
  styleUrl: './delivery-form-drawer.css',
})
export class DeliveryFormDrawer implements OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});
  protected loading: WritableSignal<boolean> = signal(false);

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input()
  set delivery(data: Partial<Delivery> | null) {
    this._form = this.formBuilder.group({});
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
