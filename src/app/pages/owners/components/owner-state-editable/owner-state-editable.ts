import { NgClass } from '@angular/common';
import { Component, computed, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { OWNER_STATE } from '@shared/types/owner';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OwnersService } from '../../owners-service';

@Component({
  selector: 'app-owner-state-editable',
  imports: [
    MenuModule,
    TagModule,
    NgClass,
    ProgressSpinnerModule
  ],
  templateUrl: './owner-state-editable.html',
  styleUrl: './owner-state-editable.css',
})
export class OwnerStateEditable {
  // vars
  state: InputSignal<boolean> = input.required<boolean>();
  id: InputSignal<number> = input.required<number>();
  protected loading: WritableSignal<boolean> = signal(false);

  // services
  private readonly ownersService: OwnersService = inject(OwnersService);

  protected items: MenuItem[] = [
    {
      id: OWNER_STATE.inactive.toString(),
      label: 'Inactif',
      icon: 'pi pi-times',
      command: () => {
        this.handleChangeState(false);
      }
    },
    {
      id: OWNER_STATE.active.toString(),
      label: 'Actif',
      icon: 'pi pi-check',
      command: () => {
        this.handleChangeState(true);
      }
    }
  ];

  protected states: Signal<MenuItem[]> = computed(() => {
    return this.items.filter(s => s.id !== this.state().toString());
  });

  private handleChangeState(newState: boolean): void {
    if (newState === this.state()) return;
  }
}
