import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotoCaptureComponent } from './photo-capture/photo-capture.component';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PhotoCaptureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    WebcamModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())  // Adiciona suporte para as APIs fetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
