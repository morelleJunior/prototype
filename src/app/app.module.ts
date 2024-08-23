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
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    PhotoCaptureComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    WebcamModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()) 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
