import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrl: './image-display.component.scss'
})
export class ImageDisplayComponent {
  @Input() imageBase64: string | null = null;
  public isModalOpen: boolean = false;


  openModal(): void {
    this.isModalOpen = true;
  }

  // Fecha o modal
  closeModal(): void {
    this.isModalOpen = false;
  }
}
