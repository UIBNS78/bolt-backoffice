import { InputSelectOptions } from "@shared/components/types/input-select-options";
import { PACKAGE_STATUS } from "@shared/types/package";
import { packageTypeObj } from "@shared/types/package";

export const packageTypeOptions: InputSelectOptions[] = [
    { id: packageTypeObj.inCity, label: "Livraison sur ville" },
    { id: packageTypeObj.outCity, label: "Livraison en province" }
];
export const packageStatusOptions: InputSelectOptions[] = [
    { id: PACKAGE_STATUS.inProgress, label: "En cours", icon: "pi pi-bullseye" },
    { id: PACKAGE_STATUS.delivered, label: "Livré", icon: "pi pi-check" },
    { id: PACKAGE_STATUS.reported, label: "Reporté", icon: "pi pi-refresh" },
    { id: PACKAGE_STATUS.cancelled, label: "Annulé", icon: "pi pi-times" },
];