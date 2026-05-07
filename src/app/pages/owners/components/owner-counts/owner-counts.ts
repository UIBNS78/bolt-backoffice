import { Component, Input } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { OwnersCount } from '../../types/owners-count';

@Component({
  selector: 'app-owner-counts',
  imports: [
    SkeletonModule,
    PluralPipe
  ],
  templateUrl: './owner-counts.html',
  styleUrl: './owner-counts.css',
})
export class OwnerCounts {
  @Input() loading: boolean = false;
  @Input() counts: OwnersCount = {
    onlineCount: 0,
    ownersCount: 0,
    premiumCount: 0,
    simpleCount: 0
  };
}
