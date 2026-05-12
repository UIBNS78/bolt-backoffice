import { InputSelectOptions } from "@shared/components/types/input-select-options";
import { deliveryStatusObj } from "@shared/types/delivery";

export const deliveryStatusOptions: InputSelectOptions[] = [
    { id: deliveryStatusObj.cancelled, label: "Annuler", icon: "pi pi-times-circle" },
    { id: deliveryStatusObj.pending, label: "En attente", icon: "pi pi-hourglass" },
    { id: deliveryStatusObj.recovery, label: "Récupération", icon: "pi pi-cart-arrow-down" },
    { id: deliveryStatusObj.delivery, label: "Livraison", icon: "pi pi-bolt" },
    { id: deliveryStatusObj.finished, label: "Terminée", icon: "pi pi-check" },
];