import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-driver-information-dialog',
  imports: [
    DialogModule,
    FileUploadModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './driver-information-dialog.html',
  styleUrl: './driver-information-dialog.css',
})
export class DriverInformationDialog {
  @Output() closeEmitter: EventEmitter<void> = new EventEmitter<void>();
  visible: InputSignal<boolean> = input.required<boolean>();

  onUpload(file: FileUploadEvent): void {
    console.log('upload', file);
  }

  handleSubmit(): void {
    console.log('submit');
    this.handleClose();
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Octet';

    const k = 1024;
    const dm = 3;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];

    // On calcule l'index de l'unité (0 pour Octets, 1 pour Ko, etc.)
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  handleClose(): void {
    this.closeEmitter.emit();
  }
}
