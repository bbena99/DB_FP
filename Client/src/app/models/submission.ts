import { Assignment } from "./assignment";

export interface Submission extends Assignment {
  SubmissionId : String,
  Comments : String,
  Points : Number,
  SubmisssionStatus : String,
  SubmissionData : Date
}
