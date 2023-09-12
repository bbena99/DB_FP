import { Class } from "./class";
import { Submission } from "./submission";

export interface Assignment {
  _id : string,
  class : Class,
  name : string,
  dueData : Date,
  totalPoints : number,
  notes : string,
  submissions : Map<string,Submission>
}
