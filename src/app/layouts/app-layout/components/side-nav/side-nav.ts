import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from '@angular/common';
import { AvatarPopover } from '../avatar-popover/avatar-popover';

@Component({
  selector: 'app-side-nav',
  imports: [
    CardModule,
    DividerModule,
    TooltipModule,
    AvatarPopover,
    RouterLink,
    RouterLinkActive,
    NgClass
],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {}
