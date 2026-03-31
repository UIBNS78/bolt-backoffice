import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-owners-placeholder',
  imports: [
    TableModule,
    SkeletonModule
  ],
  templateUrl: './owners-placeholder.html',
  styleUrl: './owners-placeholder.css',
})
export class OwnersPlaceholder {}
