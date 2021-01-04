import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FileuploadPageModule } from '../fileupload/fileupload.module';
import { FileuploadPage } from '../fileupload/fileupload.page';
import { ProgressBarPageModule } from '../progress-bar/progress-bar.module';
import { ProgressBarPage } from '../progress-bar/progress-bar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    // FileuploadPageModule,
    ProgressBarPageModule
  ],
  declarations: [HomePage, ProgressBarPage]
})
export class HomePageModule { }
