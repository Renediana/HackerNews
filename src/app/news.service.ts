import { NewsComponent } from "./news/news.component";
import { flatMap, map, mergeMap } from "rxjs/operators";
import { forkJoin, Observable, BehaviorSubject, combineLatest } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Story, VotedStory } from "./story";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NewsService {
  votes = new BehaviorSubject<{ [index: string]: number }>({});

  readonly ROOT_URL = "http://localhost:3000/";

  stories = new ReplaySubject<Story[]>();
  ids = new ReplaySubject<number[]>();
  page = new BehaviorSubject<number>(0);
  pages = new ReplaySubject<number[]>();
  comments = new ReplaySubject<string>();

  getStories(a: number): Observable<Story[]> {
    return this.ids.pipe(
      mergeMap((q) =>
        forkJoin(
          ...q
            .slice(a * 20, a * 20 + 20)
            .map((i) =>
              this.http.get<Story>(
                this.ROOT_URL + `item/${i}.json?print=pretty`, {withCredentials: true}
              )
            )
        )
      )
    );
  }

  loadVotes(a: number): Observable<{ [index: string]: number }> {
    return this.ids.pipe(
      mergeMap((i) =>
        this.http.post<{ [index: string]: number }>(
          this.ROOT_URL + `votes`,
          i.slice(a * 20, a * 20 + 20), {withCredentials: true}
        )
      )
    );
  }

  getVotes(): Observable<VotedStory[]> {
    return combineLatest(this.stories, this.votes).pipe(
      map(([stories, votes]) =>
        stories.map<VotedStory>((story) => ({
          ...story,
          vote: votes[story.id] ? votes[story.id] + story.score : story.score,
          isUpVoted: votes[story.id] === 1,
          isDownVoted: votes[story.id] === -1,
        }))
      )
    );
  }

  upVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    v[id] = x === 1 ? undefined : 1;
    const vote = x === 1 ? "resetvote" : "upvote";
    this.votes.next(v);
    this.http.get(this.ROOT_URL + `item/${id}/${vote}`, {withCredentials: true}).subscribe();
  }

  downVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    v[id] = x === -1 ? undefined : -1;
    const vote = x === -1 ? "resetvote" : "downvote";
    this.votes.next(v);
    this.http.get(this.ROOT_URL + `item/${id}/${vote}`, {withCredentials: true}).subscribe();
  }

  range(start, end) {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => start + idx);
  }

  setPage(page: number) {
    this.page.next(page);
  }

  constructor(public http: HttpClient) {
    this.http
      .get<number[]>(this.ROOT_URL + "topstories.json?print=pretty", {withCredentials: true})
      .subscribe((ids) => this.ids.next(ids));
    this.ids.subscribe((ids) => {
      const pagecount = Math.ceil(ids.length / 20);
      const pages = this.range(0, pagecount - 1);
      this.pages.next(pages);
    });
    this.page
      .pipe(mergeMap((page) => this.getStories(page)))
      .subscribe((stories) => this.stories.next(stories));
    this.page
      .pipe(mergeMap((page) => this.loadVotes(page)))
      .subscribe((votes) => this.votes.next(votes));
  }
}
