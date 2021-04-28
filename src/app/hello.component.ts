import { Component, Input, OnInit } from "@angular/core";
import { Person } from "./people.model";

@Component({
  selector: "hello",
  template: `
    <h1>Hello {{ name }}!</h1>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `
  ]
})
export class HelloComponent implements OnInit {
  @Input() name: string;
  person: Person = new Person();
  ngOnInit() {
    this.person.firstname = "John Paul";
    this.person.lastname = "Reynaldo";
    this.person.birthday = new Date("August 02, 1998");
    console.log(this.person.fullname);

    // const person = new Person();
    // person.firstname = "John Paul";
    // person.lastname = "Reynaldo";
    // person.birthday = new Date("August 02, 1998");
  }
}
