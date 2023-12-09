import { Teacher } from "./teacher";

export interface Class extends Teacher{
  ClassName : String,
  Department : String,
  CourseNumber : number,
  Section : Number,
  TeacherUsername: String
}
