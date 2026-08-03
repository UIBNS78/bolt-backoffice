import { Component, input, InputSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dm-reward-rates-handler',
  imports: [
    SplitButtonModule,
    TooltipModule
  ],
  templateUrl: './dm-reward-rates-handler.html',
  styleUrl: './dm-reward-rates-handler.css',
})
export class DmRewardRatesHandler {
  // inputs
  isLoading: InputSignal<boolean> = input.required();
  
  // vars
  protected rewardActions: MenuItem[] = [
    {
      label: "Changer",
      icon: 'pi pi-arrow-right-arrow-left',
      items: [
        {
          label: "5 000 Ar",
          icon: 'pi pi-star',
          items: [
            {
              label: "Appliquer",
              icon: "pi pi-check",
              command: () => {}
            },
            {
              label: "Modifier",
              icon: "pi pi-pencil",
              command: () => {}
            },
            {
              label: "Supprimer",
              icon: "pi pi-trash",
              command: () => {}
            }
          ]
        },
        {
          label: "10 000 Ar",
          icon: 'pi pi-star',
          items: [
            {
              label: "Appliquer",
              icon: "pi pi-check",
              command: () => {}
            },
            {
              label: "Modifier",
              icon: "pi pi-pencil",
              command: () => {}
            },
            {
              label: "Supprimer",
              icon: "pi pi-trash",
              command: () => {}
            }
          ]
        },
        {
          label: "15 000 Ar",
          icon: 'pi pi-check',
          iconClass: "text-green-500!",
          labelClass: "text-green-500",
          disabled: true,
          items: undefined
        },
      ]
    },
    { 
      label: 'Nouveau', 
      icon: 'pi pi-plus',
      command: () => {}
    },
    {
        separator: true
    },
    { 
      label: 'Désactiver', 
      icon: 'pi pi-ban',
      iconClass: "text-red-500!",
      labelClass: "text-red-500",
      command: () => {}
    },
  ];
}
