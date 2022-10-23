export enum IssueState {
  TODO = 'Todo',
  IN_PROGRESS = 'In_Progress',
  DONE = 'Done'
}

export enum IssueType {
  EPIC = 'Epic',
  STORY = 'Story',
  TASK = 'Task'
}

export interface Issue {
  id: string,
  title: string,
  state: IssueState.TODO | IssueState.IN_PROGRESS | IssueState.DONE,
  type: IssueType.TASK | IssueType.STORY | IssueType.EPIC,
  parent: Issue["id"] | {},
  children: Array<Issue["id"]>,
  assignedTo: User["id"] | null,
  createdAt: number,
  updatedAt: number,
};

export interface User {
  id: string,
  name: string,
  createdAt: number
}

export interface IssuesListParameters {
  state: IssueState | null,
  userId: User["id"] | null,
  issueTypes: IssueType[] | null,
  startDate: string | null,
  endDate: string | null
} 