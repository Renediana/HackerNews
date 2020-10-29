import { mergeMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story } from './story';


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  readonly ROOT_URL = 'https://hacker-news.firebaseio.com/v0/';

  getStories(): Observable<Story[]>{
    const ids = this.http.get<number[]>(this.ROOT_URL + 'topstories.json?print=pretty');
    return ids.pipe(mergeMap(
      q => forkJoin(...q.slice(0, 10).map( i => this.http.get<Story>(this.ROOT_URL + `item/${i}.json?print=pretty`)))));
  }
  constructor(public http: HttpClient) { }

}
