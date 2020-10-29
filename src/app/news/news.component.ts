import { NewsService } from './../news.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  stories = this.newsService.getStories();

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
  }
}
