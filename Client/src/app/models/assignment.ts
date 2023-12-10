import { Class } from "./class";

export interface Assignment extends Class {
  AssignmentID: String,
  AssignmentName : String,
  Description : String,
  TotalPoints : number,
  Visibility : Boolean,
  DueDate : String,
  maxCount : number,
  actualCount : number
}
