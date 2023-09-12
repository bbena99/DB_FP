import { Assignment } from "../assignment";
import { Class } from "../class";
import { User } from "../user";
import { Student } from "./student";

export interface Teacher extends User {
  classes : Map<string,Class>,
  students : Map<Class,Student[]>
}
