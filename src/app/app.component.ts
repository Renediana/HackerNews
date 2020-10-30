import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NewsService } from './news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Hacker News';
  pages = this.newsService.pages;

  constructor(
    private newsService: NewsService
    ) {}

}
