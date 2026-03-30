import { Component, inject, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from "primeng/button";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dialog-confirm',
  imports: [ButtonModule, NgClass],
  templateUrl: './dialog-confirm.html',
  styleUrl: './dialog-confirm.css',
})
export class DialogConfirm {
  public ref = inject(DynamicDialogRef)
  public config = inject(DynamicDialogConfig)

  @Input() title: string = "Confirmation";
  @Input() message: string = "Êtes-vous sûr de vouloir effectuer cette action ?";
  @Input() icon: string = "pi pi-exclamation-triangle";
  @Input() acceptLabel: string = "Confirmer";
  @Input() rejectLabel: string = "Annuler";

  handleAccept(): void {
    this.ref.close(true);
  }

  handleReject(): void {
    this.ref.close(false);
  }
}
