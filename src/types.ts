export enum IssueStatus {
  TODO = 0,
  IN_PROGRESS = 1,
  DONE = 2
}

export enum IssueType {
  EPIC = 0,
  STORY = 1,
  TASK = 2
}

export interface Issue {
  id: Number,
  title: String,
  status: IssueStatus.TODO,
  readonly type: IssueType // type once set cannot be changed
};

export interface User {
  id: Number,
  name: String
}