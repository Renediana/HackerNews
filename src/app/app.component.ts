import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NewsService } from './news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Hacker News';
  pages = this.newsService.pages;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute
    ) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => this.newsService.setPage(params.id-1));
  }
}
