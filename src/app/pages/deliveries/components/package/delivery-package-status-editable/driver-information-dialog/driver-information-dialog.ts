import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { FormatImageSizePipe } from '@shared/pipes/format-image-size-pipe';
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
    MessageModule,
    FormatImageSizePipe
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
  
  handleClose(): void {
    this.closeEmitter.emit();
  }
}
