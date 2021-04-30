import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { from, fromEvent, Observable, of, pipe } from "rxjs";
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
  searchInput: FormControl; 
  @Output() goToPage = new EventEmitter<number>(); //This will serve as output attribute that parent component can use
  constructor() {} 
  ngOnInit() {
    //declare new instance of the search input.
    this.searchInput = new FormControl();

    //chain event from observable event to search input
    this.searchInput.valueChanges
    .pipe( 
        //filter gets the input value, check if its more than 2 characters to proceed the search, other wise clear the result list.
        filter(text => {
          if(text.length >= 3){return true;}
          else {this.result = null;return false;}
        }),

        //debounceTime sets the search key event to get to run for a certain period to avoid log. this takes the recent input value
        debounceTime(10),
        
        // distinctUntilChanged ignore if next search query is same as previous
        distinctUntilChanged(), 

        //switch map  sets the data to new observable based on the return/source observalbe valueChanges
        //switchMap(searchTerm => this.search(searchTerm)),
        switchMap(searchTerm => { 
          return from(this.searchData).pipe(
              filter(person => person.firstname.indexOf(searchTerm) > -1),
              map(item => item as Person),
              toArray()
            );
      }),

    ).subscribe(data=>{
        this.result = data
    }); 
  }

  search(searchkey) { 
    return from(this.searchData).pipe(
      filter(person => person.firstname.indexOf(searchkey) > -1),
      map(item => item as Person),
      toArray()
    );
  }
  
  //SetPage event to emit the output attribute
  public setPage(person: Person): void {
    this.goToPage.emit(person);
  }
}
  
  testCodes(){
    

    // this.searchForm = new FormGroup({
    //     name: new FormControl()
    //   });
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


   of(1, 2, 3)
  .pipe(map((x) => x * x))
  .subscribe((v) => console.log(`value: ${v}`));

    const searchBox = document.getElementById("search");
    //fromEvent(searchBox, "input") is an observable event (observing on every changes on input type)

    const typeahead = fromEvent(searchBox, "input").pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length >= 3),
      debounceTime(10),
      distinctUntilChanged(), // ignore if next search query is same as previous
      switchMap(searchTerm => this.search(searchTerm))
    );

    typeahead.subscribe(data => { 
      this.result = data;
    });
  }
}

//https://www.tektutorialshub.com/angular/rxjs-observable-using-create-of-from-in-angular/
