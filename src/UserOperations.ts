/*
 *   This file contains all the User Related Operations
 *
 */

import { users, issues } from './index';
import { User } from './helpers/types';
import { getUniqueID } from './helpers/util';

///////////////////////////////// ADD ISSUE /////////////////////////////////////
export const addUser = (name: string): User['id'] | string => {
  if (!name || name === '') {
    return '400: AddUser Operation Failed!';
  }

  const newUser: User = {
    id: getUniqueID(),
    name,
    createdAt: Date.now(),
  };

  users.push(newUser);

  return newUser.id;
};
////////////////////////////////////////////////////////////////////////////////

///////////////////////////// GET SPECIFIC USER ///////////////////////////////
export const getSpecificUser = (userId: User['id']): User | string => {
  if (!userId) throw new Error('GetUser Operation Failed!');

  const user = users.find((user) => user.id === userId);

  if (user) {
    return user;
  } else {
    return 'GetUser Operation Failed!';
  }
};
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// ADD ISSUE ////////////////////////////////////
export const removeUser = (userId: User['id']): string => {
  if (userId === null) return 'RemoveUser Operation Failed!';

  issues.forEach((issue) => {
    if (issue.assignedTo === userId) {
      issue.assignedTo = null;
    }
  });

  const user: User | string = getSpecificUser(userId);
  if (user && typeof user !== 'string') {
    const userIndex: number = users.indexOf(user);
    if (userIndex > -1) {
      users.splice(userIndex, 1);
    }
  } else {
    return 'RemoveUser Operation Failed!';
  }

  return 'RemoveUser Operation Successfull!';
};
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// ADD ISSUE /////////////////////////////////////
export const getListOfUsers = (): Array<User> | string => {
  if (users && users.length > 0) {
    return users;
  } else {
    return 'No Users in the System yet!';
  }
};
////////////////////////////////////////////////////////////////////////////////
