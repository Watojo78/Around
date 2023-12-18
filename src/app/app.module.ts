import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HerosectionComponent } from './showcase/herosection/herosection.component';
import { WhyaroundComponent } from './showcase/whyaround/whyaround.component';
import { Feature1Component } from './showcase/feature1/feature1.component';
import { Feature2Component } from './showcase/feature2/feature2.component';
import { Feature3Component } from './showcase/feature3/feature3.component';
import { PackComponent } from './showcase/pack/pack.component';
import { TestimonyComponent } from './showcase/testimony/testimony.component';
import { FaqComponent } from './showcase/faq/faq.component';
import { ScreenshotsComponent } from './showcase/screenshots/screenshots.component';
import { TeamComponent } from './showcase/team/team.component';
import { ContactComponent } from './showcase/contact/contact.component';
import { PartnersComponent } from './showcase/partners/partners.component';
import { PrivacypolicyComponent } from './showcase/privacypolicy/privacypolicy.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SharedModule } from './Shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HerosectionComponent,
    WhyaroundComponent,
    Feature1Component,
    Feature2Component,
    Feature3Component,
    PackComponent,
    TestimonyComponent,
    FaqComponent,
    ScreenshotsComponent,
    TeamComponent,
    ContactComponent,
    PartnersComponent,
    PrivacypolicyComponent,
    HeaderComponent,
    FooterComponent,
    ShowcaseComponent,
  ],
  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
