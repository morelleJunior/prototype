import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import introJs from 'intro.js';
import { sendImageToApi } from '../services/apiService';
import { Piece } from '../piece-selection/piece.interface';


interface CapturedImageData {
  image: WebcamImage;
  correctlyAssembled: boolean;
}

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrls: ['./photo-capture.component.scss']
})

export class PhotoCaptureComponent {
  
  public capturedImages: CapturedImageData[] = [];

  public selectedImage: WebcamImage | null = null;
  public isCameraOn = true;
  public isBrowser: boolean;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isLoading = false;

  public timer: number | null = null;
  public showTimer = false;

  public uploadProgress = 0;


  private readonly maxImages = 5;

  public showFlash = false;

  public processedImageBase64: string | null = null;

  public processedCuts: Piece[] = [];

  private trigger: Subject<void> = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.triggerSnapshot();
    }
  }


  private showFlashEffect(): void {
    this.showFlash = true;
    setTimeout(() => this.showFlash = false, 100);
  }

  public triggerSnapshot(): void {
    if (this.isBrowser && this.capturedImages.length < 5) {
      this.trigger.next();
    }
  }

  public startTimer(): void {
    if (this.timer && this.timer > 0) {
      this.showTimer = true;
      const interval = setInterval(() => {
        if (this.timer && this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(interval);
          this.showTimer = false;
          this.triggerSnapshot();
        }
      }, 1000);
    } else {
      this.triggerSnapshot();
    }
    this.successMessage = null
  }

  public handleImage(webcamImage: WebcamImage): void {
    if (this.isBrowser && webcamImage instanceof WebcamImage) {
      if (this.capturedImages.length < this.maxImages) {
        const newImage: CapturedImageData = {
          image: webcamImage,
          correctlyAssembled: true
        };
        this.capturedImages.push(newImage);
        this.errorMessage = null;
      } else {
        this.errorMessage = `Limite de ${this.maxImages} imagens atingido.`;
      }
    } else {
      console.error('Erro: O evento recebido não é uma WebcamImage válida');
    }
  }

  public async sendCapturedImages(): Promise<void> {
    if (this.capturedImages.length > 0) {
      this.isLoading = true;
      const imageData = this.prepareJsonData(this.capturedImages[0]);
  
      try {
        const response = await sendImageToApi(imageData);
  
        if (response && response.data && response.data.pythonData && response.data.pythonData.pythonIntegrationResponse) {
          this.processedImageBase64 = response.data.pythonData.pythonIntegrationResponse.boundingBoxes;
          this.processedCuts = response.data.pythonData.pythonIntegrationResponse.processedCuts;
        } else {
          console.error('Resposta da API não contém as informações esperadas');
          this.errorMessage = 'Erro: A resposta da API não contém as informações esperadas.';
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private async sendImageRecursively(index: number): Promise<void> {
    if (index < this.capturedImages.length) {
      const imageData = this.prepareJsonData(this.capturedImages[index]);
  
      try {
        const response = await sendImageToApi(imageData); 

        this.successMessage = `Imagem ${index + 1} enviada com sucesso`;
        this.errorMessage = null;
        this.capturedImages.splice(index, 1);
  
        await this.sendImageRecursively(index);
      } catch (error) {
        if (error instanceof Error) {

          console.error('Erro ao enviar imagem:', error);
          this.errorMessage = `Erro ao enviar imagem ${index + 1}: ${error.message || 'Desconhecido'}`;
        } else {
          console.error('Erro desconhecido ao enviar imagem:', error);
          this.errorMessage = `Erro ao enviar imagem ${index + 1}: Erro desconhecido`;
        }
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
      if (this.capturedImages.length === 0) {
        this.successMessage = 'Todas as imagens foram enviadas com sucesso';
      }
    }
  }


  private prepareJsonData(imageData: CapturedImageData): any {
    return {
      dryer_model_id: 1,
      correctly_assembled: imageData.correctlyAssembled,
      fileBase64: imageData.image.imageAsDataUrl
    };
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

  public startTutorial(): void {

    if (this.capturedImages <= []  ) {
      this.startTimer();
    }

  
    const checkImageAdded = setInterval(() => {
      if (this.capturedImages.length > 0) {
        clearInterval(checkImageAdded);
  
        const intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: "Bem-vindo ao sistema de captura de fotos! Vamos guiá-lo pelos principais recursos."
            },
            {
              element: '.custom-webcam',
              intro: "Aqui é onde a captura de imagens acontece. Certifique-se de que o secador está bem posicionado."
            },
            {
              element: '.capture-button',
              intro: "Clique neste botão ou pressione a tecla de espaço para capturar uma foto.",
              highlightClass: 'highlight-button'
            },
            {
              element: '.gallery',
              intro: "As imagens capturadas aparecerão aqui. Você pode selecionar uma imagem para visualizá-la em detalhe."
            },
            {
              element: '.delete-button',
              intro: "Se você não estiver satisfeito com uma imagem, pode excluí-la aqui."
            },
            {
              element: '.evaluation-container',
              intro: "Classifique a imagem capturada indicando se a montagem está correta ou não."
            },
            {
              element: '.send-button',
              intro: "Depois de capturar e avaliar as imagens, clique aqui para enviá-las para análise."
            },
            {
              
              element: '.loader-container',
              intro: "Você pode acompanhar o progresso de envio das imagens aqui."
            },
            {
              element: '.image-modal',
              intro: "Clique em uma imagem para visualizá-la em tela cheia."
            },
            {
              intro: "Isso é tudo! Agora você está pronto para usar o sistema de captura de fotos."
            }
          ],
          prevLabel: 'Voltar',
          nextLabel: 'Avançar',
          doneLabel: 'Concluir',
          showProgress: true,
          showBullets: false

        });
        intro.start();


        
      }
    }, 100);


  }
  
}