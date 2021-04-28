export class Person {
  firstname: string;
  lastname: string;
  birthday: Date;
  gender: string;

  get age(): number {
    let timeDiff = Math.abs(Date.now() - this.birthday.getTime());
    let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }
  get fullname(): string {
    return this.firstname + " " + this.lastname;
  }
}
