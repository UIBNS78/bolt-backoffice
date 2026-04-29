import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, InputSignal, Output, Signal } from '@angular/core';
import { Owner } from '@shared/types/owner';
import { USER_STATE, UserState } from '@shared/types/user';
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
  @Output() onStateChangeEmitter: EventEmitter<{ userId: number; newState: UserState; }> = new EventEmitter<{ userId: number; newState: UserState; }>();
  owner: InputSignal<Owner> = input.required<Owner>();
  protected state: Signal<UserState> = computed(() => {
    return this.owner().state;
  });
  protected currentState: Signal<MenuItem> = computed(() => {
    return this.items.find(i => i.id === this.state())!;
  });
  userId: InputSignal<number> = input.required<number>();

  protected items: MenuItem[] = [
    {
      id: USER_STATE.pending,
      label: 'En attente',
      icon: 'pi pi-hourglass',
      command: () => {
        this.handleChangeState(USER_STATE.pending);
      }
    },
    {
      id: USER_STATE.confirmed,
      label: 'Confirmé',
      icon: 'pi pi-check',
      command: () => {
        this.handleChangeState(USER_STATE.confirmed);
      }
    },
    {
      id: USER_STATE.rejected,
      label: 'Rejeté',
      icon: 'pi pi-times',
      command: () => {
        this.handleChangeState(USER_STATE.rejected);
      }
    }
  ];

  protected states: Signal<MenuItem[]> = computed(() => {
    return this.items.filter(s => s.id  !== this.state());
  });

  private handleChangeState(newState: UserState): void {
    if (newState === this.state()) return;

    this.onStateChangeEmitter.emit({
      userId: this.userId(),
      newState: newState
    });
  }
}
