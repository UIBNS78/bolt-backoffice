import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { FormatImageSizePipe } from '@shared/pipes/format-image-size-pipe';
import { PACKAGE_STATUS } from '@shared/types/package';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
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
  @Output() submitEmitter: EventEmitter<FormData> = new EventEmitter<FormData>();
  visible: InputSignal<boolean> = input.required<boolean>();
  protected formData: FormData = new FormData();

  handleOnSelect(file: FileSelectEvent): void {
    this.formData.append("driverInformation", file.currentFiles[0]);
  }

  handleRemoveFile(event: PointerEvent, callback: (event: PointerEvent) => void): void {
    this.formData.delete("driverInformation");
    callback(event);
  }

  handleSubmit(): void {
    if (this.formData.get("driverInformation") === null) {
      return;
    }

    this.formData.append("status", PACKAGE_STATUS.delivered.toString());
    this.submitEmitter.emit(this.formData);
  }
  
  handleClose(): void {
    this.closeEmitter.emit();
  }
}
