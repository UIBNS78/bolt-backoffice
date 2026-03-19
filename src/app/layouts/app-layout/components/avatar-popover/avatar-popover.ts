import { Component } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-avatar-popover',
  imports: [
    AvatarModule,
    PopoverModule
  ],
  templateUrl: './avatar-popover.html',
  styleUrl: './avatar-popover.css',
})
export class AvatarPopover {}
