import { Student } from "./user/student";

export interface Submission {
  _id : string,
  student : Student,
  grade : number,
  notes : string
}
