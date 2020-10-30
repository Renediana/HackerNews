import { HttpClientModule } from '@angular/common/http';
import { NewsService } from './news.service';
import { NewsComponent } from './news/news.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'page/:id',
        component: AppComponent
    }
  ])
  ],
  providers: [NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
