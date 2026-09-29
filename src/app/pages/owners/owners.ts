import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-owners',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SkeletonModule,
    BadgeModule,
    NgClass,
    PluralPipe
],
  templateUrl: './owners.html',
  styleUrl: './owners.css',
})
export class Owners {
  protected isLoading = signal<boolean>(false);
  protected counts = signal<{
    total: number;
    onlineCount: number;
    bannedCount: number;
    pendingCount: number;
  }>({ total: 0, onlineCount: 0, bannedCount: 0, pendingCount: 0 });
}
