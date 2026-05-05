import { NotificationType } from "@shared/types/notification";

export const NOTIFICATION_MESSAGES: Record<NotificationType, string> = {
    NEW_OWNER: 'vient de créer un compte.',
    NEW_DELIVERY: 'a créée une nouvelle livraison.',
    CANCELLED_DELIVERY: 'a annulée une livraison.',
    PACKAGE_DELIVERED: 'vient de livré le colis de',
    PACKAGE_REPORTED: 'a reporté le colis de',
    PACKAGE_CANCELLED: 'a annulé le colis de',
}