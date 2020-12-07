import { NewsService } from "./../news.service";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit {

  stories = this.newsService.getVotes();
  pages = this.newsService.pages;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute
    ) {}

  upVote(id: string) {
    this.newsService.upVote(id);
  }
  downVote(id: string) {
    this.newsService.downVote(id);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.newsService.setPage(Number.parseInt(params.id) - 1));
  }
}