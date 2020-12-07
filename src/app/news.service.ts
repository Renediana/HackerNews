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
  votes = new BehaviorSubject<{ [index: string]: {myVote: number, total: number} }>({});

  readonly ROOT_URL = "https://bonenga.ddns.net/api/";

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
                this.ROOT_URL + `item/${i}.json`, {withCredentials: true}
              )
            )
        )
      )
    );
  }

  loadVotes(a: number): Observable<{ [index: string]: {myVote: number, total: number} }> {
    return this.ids.pipe(
      mergeMap((i) =>
        this.http.post<{ [index: string]: {myVote: number, total: number} }>(
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
          vote: votes[story.id] !== undefined ? votes[story.id].total + story.score : story.score,
          isUpVoted: votes[story.id] !== undefined ? votes[story.id].myVote === 1 : false,
          isDownVoted: votes[story.id] !== undefined ? votes[story.id].myVote === -1 : false,
        }))
      )
    );
  }

  upVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    const vote = x.myVote === 1 ? "resetvote" : "upvote";

    v[id] = {
      total: x.total + (x.myVote === undefined || x.myVote === -1 ? 1 : -1),
      myVote: x.myVote === undefined ? 1 : undefined};

    this.votes.next(v);
    this.http.get(this.ROOT_URL + `item/${id}/${vote}`, {withCredentials: true}).subscribe();
  }

  downVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    const vote = x.myVote === 1 ? "resetvote" : "downvote";

    v[id] = {
      total: x.total + (x.myVote === undefined || x.myVote === 1 ? -1 : 1),
      myVote: x.myVote === undefined ? -1 : undefined};

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
      .get<number[]>(this.ROOT_URL + "topstories.json", {withCredentials: true})
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
