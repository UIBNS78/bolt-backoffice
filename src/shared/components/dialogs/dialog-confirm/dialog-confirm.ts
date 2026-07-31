import { Component, inject, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule, ButtonSeverity } from "primeng/button";
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
  @Input() severity: ButtonSeverity = "danger";

  handleAccept(): void {
    this.ref.close(true);
  }

  handleReject(): void {
    this.ref.close(false);
  }

  protected getColor(): string {
    switch (this.severity) {
      case 'success':
        return 'text-green-500';
      case 'danger':
        return 'text-red-500';
      case 'warn':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'contrast':
        return 'text-gray-900';
      case 'help':
        return 'text-purple-500';
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  }

  protected getBgColor(): string {
    switch (this.severity) {
      case 'success':
        return 'bg-green-500/10';
      case 'danger':
        return 'bg-red-500/10';
      case 'warn':
        return 'bg-yellow-500/10';
      case 'info':
        return 'bg-blue-500/10';
      case 'contrast':
        return 'bg-gray-900/10';
      case 'help':
        return 'bg-purple-500/10';
      case 'primary':
        return 'bg-blue-600/10';
      case 'secondary':
        return 'bg-gray-600/10';
      default:
        return 'bg-gray-500/10';
    }
  }
}
