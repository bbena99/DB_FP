import { Class } from "./class";

export interface Assignment extends Class {
  AssignmentId : Number,
  Name : String,
  Description : String,
  FileType : String,
  TotalPoints : number,
  Visibility : Boolean,
  dueData : String,
  class : Class
}
