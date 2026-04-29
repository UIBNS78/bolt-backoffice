import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, InputSignal, Output, signal, Signal, WritableSignal } from '@angular/core';
import { Owner, OWNER_STATE } from '@shared/types/owner';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

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
  @Output() onStateChangeEmitter: EventEmitter<{ userId: number; newState: boolean; }> = new EventEmitter<{ userId: number; newState: boolean; }>();
  owner: InputSignal<Owner> = input.required<Owner>();
  protected state: Signal<boolean> = computed(() => {
    return this.owner().state;
  });
  userId: InputSignal<number> = input.required<number>();

  protected items: MenuItem[] = [
    {
      id: "false",
      label: 'Inactif',
      icon: 'pi pi-times',
      command: () => {
        this.handleChangeState(false);
      }
    },
    {
      id: "true",
      label: 'Actif',
      icon: 'pi pi-check',
      command: () => {
        this.handleChangeState(true);
      }
    }
  ];

  protected states: Signal<MenuItem[]> = computed(() => {
    return this.items.filter(s => s.id  !== this.state().toString());
  });

  private handleChangeState(newState: boolean): void {
    if (newState === this.state()) return;

    this.onStateChangeEmitter.emit({
      userId: this.userId(),
      newState: newState
    });
  }
}
