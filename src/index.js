let issues = [];
let users = [];

const getUniqueID = () => {
  return Date.now() + (Math.random() * 100000).toFixed();
};

const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === '{}';
};

const checkIssueDoneStatus = (state) => {
  if (state !== 'DONE') {
    return false;
  }
  return true;
};

const typeRules = (childType, parentType) => {
  if (
    childType === 'TASK' &&
    (parentType === 'STORY' || parentType === 'EPIC')
  ) {
    return true;
  } else if (childType === 'STORY' && parentType === 'EPIC') {
    return true;
  } else return false;
};

const checkIssuesStatusInArray = (issuesArray) => {
  let state = true;
  issuesArray.forEach((issueId) => {
    const issue = getSpecificIssue(issueId);
    const isIssueStatusDone = checkIssueDoneStatus(issue.state);
    if (!isIssueStatusDone) {
      state = false;
      return;
    }
  });
  return state;
};

const checkForChildren = (childrenIssues, type) => {
  let issueState = true;
  if (type === 'EPIC') {
    childrenIssues.forEach((childrenIssueId) => {
      const childrenIssue = getSpecificIssue(childrenIssueId);
      issueState = checkIssueDoneStatus(childrenIssue.state);
      if (!issueState) return;
      if (childrenIssue && childrenIssue.children.length > 0) {
        issueState = checkIssuesStatusInArray(childrenIssue.children);
        if (!issueState) return;
      }
    });
  } else if (type === 'STORY') {
    issueState = checkIssuesStatusInArray(childrenIssues);
    if (!issueState) return;
  }

  return issueState;
};

////////////////////////////////////////////////////////////////////////////////
const addIssue = (title, type) => {
  const newIssue = {
    id: getUniqueID(),
    title,
    state: 'TODO',
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

const removeIssue = (issueID) => {
  const issue = getSpecificIssue(issueID);

  if (!issue) return 'Remove Operation Failed!';

  // if issue is STORY
  if (!isEmptyObject(issue.parent) && issue.children.length > 0) {
    const parentIssue = getSpecificIssue(issue.parent);
    parentIssue.children = parentIssue.children.filter(
      (parentChildren) => parentChildren !== issueID
    );

    // update children's parent
    issue.children.forEach((childrenIssueId) => {
      const childrenIssue = getSpecificIssue(childrenIssueId);
      childrenIssue.parent = issue.parent;
      // update parent's children
      parentIssue.children.push(childrenIssueId);
    });
  }
  // if issue is EPIC
  else if (isEmptyObject(issue.parent) && issue.children.length > 0) {
    issue.children.forEach((childrenIssueId) => {
      const childrenIssue = getSpecificIssue(childrenIssueId);
      childrenIssue.parent = {};
    });
  }
  // if issue is TASK
  else if (!isEmptyObject(issue.parent) && issue.children.length === 0) {
    const parentIssue = getSpecificIssue(issue.parent);
    parentIssue.children = parentIssue.children.filter(
      (parentChildren) => parentChildren !== issueID
    );
  }

  issues = issues.filter((issue) => issue.id !== issueID);
  return 'Remove Operation Successful!';
};

const setIssueState = (issueID, state) => {
  const issue = getSpecificIssue(issueID);

  if (issue) {
    if (
      state === 'DONE' &&
      issue.type !== 'TASK' &&
      issue.children &&
      issue.children.length > 0
    ) {
      const isConnectedTasksDone = checkForChildren(issue.children, issue.type);

      if (isConnectedTasksDone) {
        issue.state = state;
        return 'SetState Operation Successful!';
      } else {
        return 'SetState Operaton Failed!';
      }
    }

    issue.state = state;
    issue.updatedAt = Date.now();
    return 'SetState Operation Successful!';
  }
};

const getSpecificIssue = (issueID) => {
  const issue = issues.find((issue) => issue.id === issueID);

  if (issue) {
    return issue;
  } else {
    return 'Issue not found!';
  }
};

const setParentIssue = (issueID, parentIssueID) => {
  const childIssue = getSpecificIssue(issueID);
  const parentIssue = getSpecificIssue(parentIssueID);

  const isRulesFollowed = typeRules(childIssue.type, parentIssue.type);

  if (isRulesFollowed) {
    childIssue.parent = parentIssueID;
    parentIssue.children.push(issueID);
    return 'SetParent Operation Successful!';
  } else {
    return 'SetParent Operation Failed!';
  }
};

const assignUserToIsssue = (userId, issueId) => {
  const issue = getSpecificIssue(issueId);
  if (issue && userId === null) {
    issue.assignedTo = {};
    return;
  }

  issue.assignedTo = userId;
  return 'AssignIssue Operation Successful!';
};

const getListOfIssues = ({
  state = null,
  userId = null,
  issueTypes = null,
  startDate = null,
  endDate = null,
}) => {
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

  if (issueTypes) {
    issuesList = issuesList.filter((issue) => {
      return issueTypes.includes(issue.type);
    });
  }

  if (startDate && endDate) {
    issuesList = issuesList.filter(
      (issue) => issue.createdAt >= startDate && issue.createdAt <= endDate
    );
  }

  if (startDate && !endDate) {
    issuesList = issuesList.filter((issue) => issue.createdAt >= startDate);
  }

  if (!startDate && endDate) {
    issuesList = issuesList.filter((issue) => issue.createdAt < endDate);
  }

  return issuesList;
};

const addUser = (name) => {
  if (!name || name === '') return 'AddUser Operation Failed!';

  const newUser = {
    id: getUniqueID(),
    name,
    createdAt: Date.now(),
  };

  users.push(newUser);

  return newUser.id;
};

const removeUser = (userId) => {
  if (userId === null) return 'RemoveUser Operation Failed!';

  const allIssues = getListOfIssues({});

  allIssues.forEach((issue) => {
    if (issue.assignedTo === userId) {
      issue.assignedTo = null;
    }
  });

  issues = allIssues;

  users = users.filter((user) => user.id !== userId);

  return 'RemoveUser Operation Successfull!';
};

const getSpecificUser = (userId) => {
  const user = users.find((user) => user.id === userId);

  if (user) {
    return user;
  } else {
    return 'GetUser Operation Failed!';
  }
};

const getListOfUsers = () => {
  if (users.length > 0) {
    return users;
  } else {
    ('No Users in the System yet!');
  }
};

const test1 = () => {
  const issue1 = addIssue('Bug-1', 'TASK');
  const issue2 = addIssue('Performance-1', 'STORY');
  const issue3 = addIssue('Sprint-1', 'EPIC');

  // console.log(getSpecificIssue(issue1));
  // console.log(getSpecificIssue(issue2));
  // console.log(getSpecificIssue(issue3));

  const parent = setParentIssue(issue1, issue2);
  console.log(parent);

  const parent2 = setParentIssue(issue2, issue3);
  console.log(parent2);

  const taskDone = setIssueState(issue1, 'DONE');
  console.log(taskDone);

  const storyDone = setIssueState(issue2, 'DONE');
  console.log(storyDone);

  const epicDone = setIssueState(issue3, 'DONE');
  console.log(epicDone);

  const user1 = addUser('Abdullah');
  const user2 = addUser('Aksel');

  const assignIssueUser1 = assignUserToIsssue(user1, issue1);
  console.log(assignIssueUser1);

  const assignIssueUser2 = assignUserToIsssue(user2, issue2);
  console.log(assignIssueUser2);

  const issuesList = getListOfIssues({ issueTypes: ['TASK', 'EPIC'] });
  console.log('State Filtering:: ', issuesList);

  const removeUser1 = removeUser(user1);
  console.log(removeUser1);

  const issueOneTime = issues[0].createdAt;

  const issuesList2 = getListOfIssues({
    startDate: issueOneTime,
    endDate: Date.now(),
  });
  console.log('Time Filtering:: ', issuesList2);

  // const removeIssue1 = removeIssue(issue1);
  // console.log(removeIssue1);

  // console.log(getSpecificIssue(issue2));
  // console.log(getSpecificIssue(issue3));

  console.log(issues);
};

test1();
