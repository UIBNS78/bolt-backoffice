import type { InputSelectOptions } from "@shared/components/types/input-select-options";
import { packageTypeObj } from "@shared/types/package";

export const packageTypeOptions: InputSelectOptions[] = [
    { id: packageTypeObj.inCity, label: "Livraison sur ville" },
    { id: packageTypeObj.outCity, label: "Livraison en province" }
];