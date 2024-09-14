import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface IPieceData {
  id: number;
  correctly: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PieceService {

  private apiUrl = '/api/images/receiveResponseOfTraining';

  constructor(private http: HttpClient) {}

  async sendPieceData(pieceData: IPieceData[]): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { data: pieceData };

    try {

      const response$ = this.http.post(this.apiUrl, body, { headers });
      const response = await lastValueFrom(response$); 
      
      if (!response) {
        throw new Error('Erro: A resposta da API é inválida.');
      }

      return response;
      
    } catch (error: any) {

      throw new Error(`Erro na requisição: ${error.message || error.status}`);
    }
  }
}