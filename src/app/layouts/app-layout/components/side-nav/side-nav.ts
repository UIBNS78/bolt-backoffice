import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  imports: [
    CardModule,
    DividerModule,
    AvatarModule,
    TooltipModule,
    RouterLink,
    RouterLinkActive,
    NgClass
],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {}
