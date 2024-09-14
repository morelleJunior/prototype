import { Component, Input } from '@angular/core';
import { Piece } from './piece.interface';
import { IPieceData, PieceService } from '../services/piece.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-piece-selection',
  templateUrl: './piece-selection.component.html',
  styleUrls: ['./piece-selection.component.scss']
})
export class PieceSelectionComponent {


  resetComponent(): void {
    this.selectedOptions = [];
  }

  @Input() processedCuts: Piece[] = [];

  public selectedOptions: Piece[] = [];

  constructor(private pieceService: PieceService, private dialog: MatDialog) {}

  updateSelectedOptions(selectedItems: any): void {
    this.selectedOptions = selectedItems.map((option: any) => option.value);
  }

  async submitResult(): Promise<void> {
    const responseData: IPieceData[] = this.processedCuts.map(piece => ({
      id: piece.id,
      correctly: !this.selectedOptions.includes(piece)
    }));

    try {
      const response = await this.pieceService.sendPieceData(responseData);

      if (response.message === 'Success') {
        this.openSuccessDialog();
      }
      
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  }

  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent);

    dialogRef.afterClosed().subscribe(() => {

      window.location.reload();
    });
  }
}
