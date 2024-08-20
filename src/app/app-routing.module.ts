import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoCaptureComponent } from './photo-capture/photo-capture.component';

const routes: Routes = [
  { path: '', component: PhotoCaptureComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
