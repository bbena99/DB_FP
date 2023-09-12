import { Class } from "../class";
import { User } from "../user";

export interface Student extends User {
  classes : Map<string,Class>
}
