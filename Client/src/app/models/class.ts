import { Assignment } from "./assignment";
import { Submission } from "./submission";
import { Student } from "./user/student";
import { Teacher } from "./user/teacher";

export interface Class {
  _id : string,
  assignments : Map<string,Assignment>,
  teacher : Teacher,
  students : Student[]
}
