import { Component, EventEmitter, Input, input, InputSignal, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-package-activities',
  imports: [
    DrawerModule
  ],
  templateUrl: './package-activities.html',
  styleUrl: './package-activities.css',
})
export class PackageActivities {
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  packageId: InputSignal<number | undefined> = input<number | undefined>(undefined);

  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
