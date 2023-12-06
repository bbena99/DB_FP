import { Teacher } from "./teacher";

export interface Class extends Teacher{
  Name : String,
  Department : String,
  CourseNumber : number,
  Section : Number
}
