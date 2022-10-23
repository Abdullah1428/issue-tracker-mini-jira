import { Issue, IssueState, IssueType, User } from './helpers/types';
import {
  addIssue,
  assignIsssuetoUser,
  getListOfIssues,
  getSpecificIssue,
  removeIssue,
  setIssueState,
  setParentIssue,
} from './IssueOperations';
import { addUser, removeUser } from './UserOperations';

export let issues: Array<Issue> = [];
export let users: Array<User> = [];

const App = () => {
  const issue1 = addIssue('Bug-1', IssueType.TASK);
  const issue2 = addIssue('Performance-1', IssueType.STORY);
  const issue3 = addIssue('Sprint-1', IssueType.EPIC);

  console.log('Issue One created: ', getSpecificIssue(issue1));
  console.log('Issue Two created: ', getSpecificIssue(issue2));
  console.log('Issue Three created: ', getSpecificIssue(issue3));

  const parent = setParentIssue(issue1, issue2);
  console.log('Issue One (Task) has a Issue Two as parent (Story): ', parent);

  const parent2 = setParentIssue(issue2, issue3);
  console.log(
    'Issue Two (Story) has a Issue Three as parent (EPIC): ',
    parent2
  );

  const taskDone = setIssueState(issue1, IssueState.DONE);
  console.log('Issue One state is changed to done: ', taskDone);

  const storyDone = setIssueState(issue2, IssueState.DONE);
  console.log('Issue Two state is changed to done: ', storyDone);

  const epicDone = setIssueState(issue3, IssueState.DONE);
  console.log('Issue Three state is changed to done: ', epicDone);

  const user1 = addUser('Abdullah');
  const user2 = addUser('Aksel');
  console.log('Abdullah and Aksel users created with ids: ', user1, user2);

  const assignIssueUser1 = assignIsssuetoUser(user1, issue1);
  console.log('Issue 1 assigned to User 1 - Abdullah:', assignIssueUser1);

  const assignIssueUser2 = assignIsssuetoUser(user2, issue2);
  console.log('Issue 2 assigned to User 2 - Aksel:', assignIssueUser2);

  const issuesList = getListOfIssues({
    issueTypes: [IssueType.TASK, IssueType.EPIC],
    state: null,
    userId: null,
    startDate: null,
    endDate: null,
  });
  console.log('Getting IssuesList using Issue State Filtering:: ', issuesList);

  const removeUser1 = removeUser(user1);
  console.log('User 1 - Abdullah removed:', removeUser1);

  const issueOneTime = issues[0].createdAt;

  const issuesList2 = getListOfIssues({
    startDate: String(issueOneTime),
    endDate: String(Date.now()),
    state: null,
    issueTypes: null,
    userId: null,
  });
  console.log('Getting IssuesList using Time Filtering:: ', issuesList2);

  const removeIssue1 = removeIssue(issue1);
  console.log('Issue One removed: ', removeIssue1);

  console.log('Current Issues in the system: ', issues);
  console.log('Current Users in the system: ', users);
};


App();