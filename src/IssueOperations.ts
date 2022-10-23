/*
 *   This file contains all the Issue Related Operations
 *
 */

import { issues } from './index';
import {
  Issue,
  IssuesListParameters,
  IssueState,
  IssueType,
  User,
} from './helpers/types';
import {
  checkIfAllChildrenIssuesAreDone,
  getUniqueID,
  isEmptyObject,
  parentIssueRules,
} from './helpers/util';

///////////////////////////////// ADD ISSUE /////////////////////////////////////
export const addIssue = (
  title: string,
  type: IssueType
): Issue['id'] | string => {
  if (!title || title === '' || !type) {
    return '400: AddIssue Operation Failed!';
  }

  const newIssue: Issue = {
    id: getUniqueID(),
    title,
    state: IssueState.TODO,
    type,
    parent: {},
    children: [],
    assignedTo: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  issues.push(newIssue);

  return newIssue.id;
};
////////////////////////////////////////////////////////////////////////////////

//////////////////////////// GET SPECIFIC ISSUE ///////////////////////////////
export const getSpecificIssue = (issueID: Issue['id'] | {}): Issue | string => {
  const issue = issues.find((issue) => issue.id === issueID);

  if (issue) {
    return issue;
  } else {
    return '400: GetSpecificIssue Operation Failed, Issue not found!';
  }
};
////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// REMOVE ISSUE ///////////////////////////////////
export const removeIssue = (issueId: string): string => {
  if (!issueId) return '400: RemoveIssue Operation Failed!';

  const issue: Issue | string = getSpecificIssue(issueId);
  if (!issue) return '400: RemoveIssue Operation Failed!';

  // if issue is STORY
  if (typeof issue !== 'string') {
    if (!isEmptyObject(issue.parent) && issue.children.length > 0) {
      const parentIssue: Issue | string = getSpecificIssue(issue.parent);

      if (typeof parentIssue !== 'string') {
        parentIssue.children = parentIssue.children.filter(
          (parentChildren) => parentChildren !== issueId
        );

        // update children's parent
        issue.children.forEach((childrenIssueId) => {
          const childrenIssue: Issue | string =
            getSpecificIssue(childrenIssueId);

          if (typeof childrenIssue !== 'string') {
            childrenIssue.parent = issue.parent;
            // update parent's children
            parentIssue.children.push(childrenIssueId);
          }
        });
      }
    }
    // if issue is EPIC
    else if (isEmptyObject(issue.parent) && issue.children.length > 0) {
      issue.children.forEach((childrenIssueId) => {
        const childrenIssue = getSpecificIssue(childrenIssueId);

        if (typeof childrenIssue !== 'string') {
          childrenIssue.parent = {};
        }
      });
    }
    // if issue is TASK
    else if (!isEmptyObject(issue.parent) && issue.children.length === 0) {
      const parentIssue = getSpecificIssue(issue.parent);

      if (typeof parentIssue !== 'string') {
        if (parentIssue.children && parentIssue.children.length > 0) {
          parentIssue.children = parentIssue.children.filter(
            (parentChildren) => parentChildren !== issueId
          );
        }
      }
    }

    // IF NONE OF THE ABOVE JUST REMOVE THE TASK
    const issueIndex = issues.indexOf(issue);
    if (issueIndex > -1) {
      issues.splice(issueIndex, 1);
    }
  }

  return '200: RemoveIssue Operation Successful!';
};
////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// SET ISSUE STATE ////////////////////////////////
export const setIssueState = (
  issueId: Issue['id'],
  state: IssueState
): string => {
  if (!issueId || !state) return '400: SetState Operation Failed!';

  const issue: Issue | string = getSpecificIssue(issueId);

  if (issue && typeof issue !== 'string') {
    if (
      state === IssueState.DONE &&
      issue.type !== IssueType.TASK &&
      issue.children &&
      issue.children.length > 0
    ) {
      const isChildrenTasksDone: boolean = checkIfAllChildrenIssuesAreDone(
        issue.children,
        issue.type
      );

      if (isChildrenTasksDone) {
        issue.state = state;
        return '400: SetState Operation Successful!';
      } else {
        return '400: SetState Operaton Failed!';
      }
    }

    issue.state = state;
    issue.updatedAt = Date.now();
    return '200: SetState Operation Successful!';
  } else {
    return '400: SetState Operation Failed!';
  }
};
////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// SET PARENT STATE ///////////////////////////////
export const setParentIssue = (
  issueId: Issue['id'],
  parentIssueId: Issue['id']
): string => {
  if (!issueId || !parentIssueId) return '400: SetParent Operation Failed!';

  const childIssue: Issue | string = getSpecificIssue(issueId);
  const parentIssue: Issue | string = getSpecificIssue(parentIssueId);

  if (
    childIssue &&
    parentIssue &&
    typeof childIssue !== 'string' &&
    typeof parentIssue !== 'string'
  ) {
    const isRulesFollowed: boolean = parentIssueRules(
      childIssue.type,
      parentIssue.type
    );

    if (isRulesFollowed) {
      childIssue.parent = parentIssueId;
      parentIssue.children.push(issueId);
      return '200: SetParent Operation Successful!';
    } else {
      return '400: SetParent Operation Failed!';
    }
  } else {
    return '400: SetParent Operation Failed!';
  }
};
////////////////////////////////////////////////////////////////////////////////

//////////////////////////// ASSIGN ISSUE TO USER //////////////////////////////
export const assignIsssuetoUser = (
  userId: User['id'],
  issueId: Issue['id']
): string => {
  if (!userId || !issueId) return '400: AssignIssue Operation Failed!';

  const issue: Issue | string = getSpecificIssue(issueId);

  if (issue && typeof issue !== 'string') {
    if (issue && userId === null) {
      issue.assignedTo = null;
      return '200: AssignIssue Operation Successful!';
    }

    issue.assignedTo = userId;
    return '200: AssignIssue Operation Successful!';
  } else {
    return '400: AssignIssue Operation Failed!';
  }
};
////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// GET LIST OF ISSUES ////////////////////////////
export const getListOfIssues = ({
  state = null,
  userId = null,
  issueTypes = null,
  startDate = null,
  endDate = null,
}: IssuesListParameters): Array<Issue> => {
  let issuesList = issues;

  if (
    state === null &&
    userId === null &&
    issueTypes === null &&
    startDate === null &&
    endDate === null
  ) {
    issuesList = issues;
  }

  if (state) {
    issuesList = issuesList.filter((issue) => issue.state === state);
  }

  if (userId) {
    issuesList = issuesList.filter((issue) => issue.assignedTo === userId);
  }

  if (issueTypes && issueTypes.length > 0) {
    issuesList = issuesList.filter((issue) => {
      return issueTypes.includes(issue.type);
    });
  }

  if (startDate && endDate) {
    if (Number(startDate) <= Number(endDate)) {
      issuesList = issuesList.filter(
        (issue) =>
          Number(issue.createdAt) >= Number(startDate) &&
          Number(issue.createdAt) <= Number(endDate)
      );
    }
  }

  if (startDate && !endDate) {
    issuesList = issuesList.filter(
      (issue) => Number(issue.createdAt) >= Number(startDate)
    );
  }

  if (!startDate && endDate) {
    issuesList = issuesList.filter(
      (issue) => Number(issue.createdAt) < Number(endDate)
    );
  }

  return issuesList;
};
////////////////////////////////////////////////////////////////////////////////
