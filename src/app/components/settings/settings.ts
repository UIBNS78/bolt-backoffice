import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { GeneralSettings } from './components/general-settings/general-settings';
import { MyAccountSettings } from './components/my-account-settings/my-account-settings';
import { NotificationSettings } from './components/notification-settings/notification-settings';
import { SecuritySettings } from './components/security-settings/security-settings';

@Component({
  selector: 'app-settings',
  imports: [
    TooltipModule,
    DrawerModule,
    SelectButtonModule,
    FormsModule,
    GeneralSettings,
    MyAccountSettings,
    NotificationSettings,
    SecuritySettings
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  open: WritableSignal<boolean> = signal(false);
  selected: WritableSignal<number> = signal(1);

  handleOpen(): void {
    this.open.set(true);
  }

  handleClose(): void {
    this.open.set(false);
    this.selected.set(1);
  }
}
