import { Component, inject, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { AvatarModule } from 'primeng/avatar';
import { Authentication } from 'app/pages/authentication/authentication';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';

@Component({
  selector: 'app-avatar-popover',
  imports: [
    AvatarModule,
    PopoverModule
  ],
  providers: [
    DialogService,
    Authentication
  ],
  templateUrl: './avatar-popover.html',
  styleUrl: './avatar-popover.css',
})
export class AvatarPopover {
  protected authService: Authentication = inject(Authentication);
  protected dialogService: DialogService = inject(DialogService);
  protected ref: DynamicDialogRef<DialogConfirm> | null = null;
  
  @ViewChild("profilePopover") profilePopover!: Popover

  handleLogout(): void {
    this.profilePopover.hide();
    
    this.ref = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Déconnexion",
        message: "Êtes-vous sûr de vouloir vous déconnecter ?",
        icon: "pi pi-sign-out",
        acceptLabel: "Oui, se déconnecter",
      },
      modal: true,
      draggable: false,
      resizable: false
    });

    this.ref?.onClose.subscribe(accepted => {
      if (accepted) {
        this.authService.logout();
      }
    });
  }
}
