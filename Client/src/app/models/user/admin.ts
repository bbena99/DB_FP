import { User } from "../user";
import { Student } from "./student";
import { Teacher } from "./teacher";

export interface Admin extends User {
  teachers : Teacher[],
  moderation : Map<string,Student>
}
