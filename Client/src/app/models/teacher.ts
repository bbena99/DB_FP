import { Student } from "./student";

export interface Teacher extends Student{
  DepartmentId : Number,
  ReportsTo : String
}
