import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  public isBrowser: boolean;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isLoading = false;

  private trigger: Subject<void> = new Subject<void>();
  private readonly maxImages = 10;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public triggerSnapshot(): void {
    if (this.isBrowser && this.capturedImages.length < this.maxImages) {
      this.trigger.next();
    } else {
      this.errorMessage = `Você só pode capturar até ${this.maxImages} imagens.`;
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    if (this.isBrowser && webcamImage instanceof WebcamImage) {
      if (this.capturedImages.length < this.maxImages) {
        this.webcamImage = webcamImage;
        this.capturedImages.push(webcamImage);
        console.log('Imagem capturada', webcamImage);
        this.errorMessage = null;
      } else {
        this.errorMessage = `Limite de ${this.maxImages} imagens atingido.`;
      }
    } else {
      console.error('Erro: O evento recebido não é uma WebcamImage válida');
    }
  }

  public sendCapturedImages(): void {
    if (this.capturedImages.length > 0) {
      this.isLoading = true; 
      this.capturedImages.forEach((image, index) => {
        const jsonData = this.prepareJsonData(image.imageAsDataUrl);
        this.sendImageData(jsonData, index);
      });
    } else {
      this.errorMessage = 'Nenhuma imagem capturada para enviar';
    }
  }

  private prepareJsonData(imageBase64: string): any {
    return {
      dryer_model_id: 1,
      correctly_assembled: true,
      fileBase64: imageBase64
    };
  }

  private sendImageData(jsonData: any, index: number): void {
    const apiUrl = '/api'; 

    this.http.post(apiUrl, jsonData, { responseType: 'json' }).subscribe(
      response => {
        this.successMessage = `Imagens Enviadas com Sucesso`;
        this.capturedImages.splice(index, 1);
        console.log('Resposta da API:', response);
        if (this.capturedImages.length === 0) {
          this.isLoading = false; 
        }
      },
      error => {
        this.errorMessage = `Erro ao enviar imagem ${index + 1}: ` + (error.error?.message || error.message || 'Desconhecido');
        this.successMessage = null;
        this.isLoading = false;
        console.error('Erro ao enviar imagem', error, jsonData);
      }
    );
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
