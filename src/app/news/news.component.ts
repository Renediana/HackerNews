import { NewsService } from "./../news.service";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit {

  stories = this.newsService.getVotes();

  constructor(
    private newsService: NewsService) {}

  upVote(id: string) {
    this.newsService.upVote(id);
  }
  downVote(id: string) {
    this.newsService.downVote(id);
  }

  ngOnInit(): void {}
}