import { Component } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrls: ['./photo-capture.component.scss']
})
export class PhotoCaptureComponent {
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: any): void {
    if (webcamImage instanceof WebcamImage) {
      this.webcamImage = webcamImage;
      console.log('Received webcam image', webcamImage);
    } else {
      console.error('Error: The event received is not a valid WebcamImage');
    }
  }
  

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
