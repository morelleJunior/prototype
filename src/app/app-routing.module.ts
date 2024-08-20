import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoCaptureComponent } from './photo-capture/photo-capture.component';

const routes: Routes = [
  { path: '', redirectTo: '/photo-capture', pathMatch: 'full' },
  { path: 'photo-capture', component: PhotoCaptureComponent },
  // Outras rotas podem ser adicionadas aqui
  { path: '**', redirectTo: '/photo-capture' } // Redireciona para 'photo-capture' caso a rota não seja encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
