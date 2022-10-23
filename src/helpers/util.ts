import { getSpecificIssue } from '../IssueOperations';
import { Issue, IssueState, IssueType, User } from './types';

// get Unique ID
export const getUniqueID = (): string => {
  return Date.now() + (Math.random() * 100000).toFixed();
};

// check for empty object
export const isEmptyObject = (obj: Issue['parent']): boolean => {
  return JSON.stringify(obj) === '{}';
};

// check if issue state is DONE or not
export const isIssueStateDone = (state: IssueState): boolean => {
  if ((state as IssueState) !== IssueState.DONE) {
    return false;
  }
  return true;
};

// check for rulles if the childType issue can be assigned to parentType
export const parentIssueRules = (
  childType: IssueType,
  parentType: IssueType
): boolean => {
  if (
    (childType as IssueType) === IssueType.TASK &&
    ((parentType as IssueType) === IssueType.STORY ||
      (parentType as IssueType) === IssueType.EPIC)
  ) {
    return true;
  } else if (
    (childType as IssueType) === IssueType.STORY &&
    (parentType as IssueType) === IssueType.EPIC
  ) {
    return true;
  } else return false;
};

// see the children issues state in an array
export const isChildrenIssuesStateDone = (
  issuesArray: Array<Issue['id']>
): boolean => {
  let state = true;
  issuesArray.forEach((issueId) => {
    const issue: Issue | string = getSpecificIssue(issueId);

    if (issue && typeof issue !== 'string') {
      const isIssueStatusDone = isIssueStateDone(issue.state);
      if (!isIssueStatusDone) {
        state = false;
        return;
      }
    }
  });
  return state;
};

// check for state DONE in all children in EPIC and STORY issue
export const checkIfAllChildrenIssuesAreDone = (
  childrenIssues: Array<Issue['id']>,
  issueType: IssueType
): boolean => {
  let issueState: boolean = true;

  if ((issueType as IssueType) === IssueType.EPIC) {
    childrenIssues.forEach((childrenIssueId) => {
      const childrenIssue: Issue | string = getSpecificIssue(childrenIssueId);

      if (childrenIssue && typeof childrenIssue !== 'string') {
        issueState = isIssueStateDone(childrenIssue.state);
        if (!issueState) return;

        if (childrenIssue && childrenIssue.children.length > 0) {
          issueState = isChildrenIssuesStateDone(childrenIssue.children);
          if (!issueState) return;
        }
      }
    });
  } else if ((issueType as IssueType) === IssueType.STORY) {
    issueState = isChildrenIssuesStateDone(childrenIssues);
    if (!issueState) return issueState;
  }

  return issueState;
};
