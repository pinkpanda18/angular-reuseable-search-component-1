import { Component, OnInit, Input } from "@angular/core";
import { from, fromEvent, Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
toArray
} from "rxjs/operators";
import { Person } from "../people.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  @Input() searchData: Person[];
  result: Person[];
  searchForm = new FormControl("");

  constructor() {}

  ngOnInit() {  
    //emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
    const source = from([
      { name: "Joe 31", age: 31 },
      { name: "Joe 35", age: 35 },
      { name: "Bob", age: 25 }
    ]);
    //filter out people with age under 30
    const example = source.pipe(filter(person => person.age >= 30));

    //output: "Over 30: Joe"
    const subscribe = example.subscribe(val =>
      console.log(`Over 30: ${val.name}`)
    );

    const searchBox = document.getElementById("search-box"); 
    //fromEvent(searchBox, "input") is an observable event (observing on every changes on input type)

    const typeahead = fromEvent(searchBox, "input").pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length >= 3),
      debounceTime(10),
      distinctUntilChanged(), // ignore if next search query is same as previous 
      switchMap(searchTerm => this.search(searchTerm))
    );

    typeahead.subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  search(searchkey) { 
    return from(this.searchData).pipe(
      filter(person => person.firstname.indexOf(searchkey) > -1),
      map(item => item as Person),
      toArray()
    );
  }
}

//https://www.tektutorialshub.com/angular/rxjs-observable-using-create-of-from-in-angular/
