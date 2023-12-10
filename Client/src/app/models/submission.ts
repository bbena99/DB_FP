import { Assignment } from "./assignment";

export interface Submission extends Assignment {
  SubmissionId : String,
  Comments : String,
  Points : Number,
  StudentAnswer : string,
  SubmissionDate : string
}
