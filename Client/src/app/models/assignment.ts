import { Class } from "./class";

export interface Assignment extends Class {
  AssignmentId : String,
  AssignName : String,
  Description : String,
  FileType : String[],
  TotalPoints : number,
  Visibility : Boolean,
  dueData : String,
}
