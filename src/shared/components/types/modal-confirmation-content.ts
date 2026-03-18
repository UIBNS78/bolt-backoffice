export interface ModalConfirmationContent {
    title?: string;
    question: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    confirmButtonBg?: "danger" | "success" | "warning" | "dark";
}