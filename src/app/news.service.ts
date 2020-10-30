import { map, mergeMap } from 'rxjs/operators';
import { forkJoin, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story, VotedStory } from './story';


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  votes = new BehaviorSubject<{[index:string]:number}>({});

  readonly ROOT_URL = 'https://hacker-news.firebaseio.com/v0/';

  getStories(): Observable<Story[]>{
    const ids = this.http.get<number[]>(this.ROOT_URL + 'topstories.json?print=pretty');
    return ids.pipe(mergeMap(
      q => forkJoin(...q.slice(0, 10).map( i => this.http.get<Story>(this.ROOT_URL + `item/${i}.json?print=pretty`)))));
  }

  getVotes(): Observable<VotedStory[]> {
    return combineLatest(this.getStories(), this.votes).pipe(
      map(([stories, votes]) => stories.map(
        story => ({...story, vote: votes[story.id]})
      ))
    )
  }
  getScore(stories) {
    stories.subscribe( ss => this.votes.next( ss.reduce( (current,sum) => ({ ...sum, [current.id] : current.score }) , {} ) ) );
  }

  upVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    v[id] = x != undefined ? x+1 : 1;
    this.votes.next(v);
  }
  downVote(id: string) {
    const v = this.votes.value;
    const x = v[id];
    v[id] = x != undefined ? x-1 : 1;
    this.votes.next(v);
  }

  constructor(public http: HttpClient) { }

}
