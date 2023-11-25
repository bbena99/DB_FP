import { Class } from "./class";

export interface Assignment {
  AssignmentId : Number,
  Name : String,
  Description : String,
  FileType : String,
  TotalPoints : number,
  Visibility : Boolean,
  dueData : String,
  class : Class
}
