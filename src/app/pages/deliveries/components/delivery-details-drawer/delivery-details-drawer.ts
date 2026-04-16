import { Component, EventEmitter, input, Input, InputSignal, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delivery-details-drawer',
  imports: [
    DrawerModule,
    PanelModule,
    AvatarModule,
    TooltipModule,
    TagModule
  ],
  templateUrl: './delivery-details-drawer.html',
  styleUrl: './delivery-details-drawer.css',
})
export class DeliveryDetailsDrawer implements OnInit, OnDestroy {
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  deliveryId: InputSignal<number | undefined> = input<number | undefined>(undefined);
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadData(): void {
    if (!this.deliveryId()) {
      this.isLoading.set(false);
      return;
    }


  }
  
  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
