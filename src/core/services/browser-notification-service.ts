import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserNotificationService {
  
  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  show(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) {
      console.error("Ce navigateur ne supporte pas les notifications.");
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: "images/bolt-logo.png",
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else if (Notification.permission !== 'denied') {
      this.requestPermission();
    }
  }
}
