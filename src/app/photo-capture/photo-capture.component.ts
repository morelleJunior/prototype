import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrls: ['./photo-capture.component.scss']
})
export class PhotoCaptureComponent {
  public webcamImage: WebcamImage | null = null;
  public capturedImages: WebcamImage[] = [];
  public selectedImage: WebcamImage | null = null;
  public isCameraOn = true;
  private trigger: Subject<void> = new Subject<void>();
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public triggerSnapshot(): void {
    if (this.isBrowser) {
      this.trigger.next();
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    if (this.isBrowser && webcamImage instanceof WebcamImage) {
      this.webcamImage = webcamImage;
      this.capturedImages.push(webcamImage);
      console.log('Received webcam image', webcamImage);
    } else {
      console.error('Error: The event received is not a valid WebcamImage');
    }
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public openImage(image: WebcamImage): void {
    if (this.isBrowser) {
      this.selectedImage = image;
    }
  }

  public closeImage(): void {
    if (this.isBrowser) {
      this.selectedImage = null;
    }
  }

  public deleteImage(index: number): void {
    if (this.isBrowser) {
      this.capturedImages.splice(index, 1);
    }
  }
}
