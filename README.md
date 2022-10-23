# Interview Case v1.9 - BonTouch

## Task: Implement an Issue Tracking Engine

### Implemented by - Abdullah Abdullah

### How To Run the App

- first - run command "npm install" in the root directory
- secoond - run command "npm run start" and open htpp://localhost:8080

A simple test scenario for testing the issue tracker is written inside src/index.ts file.
The test is defined inside the function named App(). For simplicity the output is consoled to the browser.

To see output open your console on the browser and there you can see different output for all the operations executed.

### How To Run Unit Tests

- first - go to src/index.ts file and comment the line 84 that is App().

```

// App()

```

- second - run command "npm run test" in the root directory. This will run all the unit tests defined for this application.

### Project Structure

- src/helpers/utils.ts - contains helper functions
- src/helpers/types.ts - contains typescript types defined for issue, user etc

- src/IssueOperations.ts - contains all operations related to issue.
- src/UserOperations.ts - contains all operations related to user.

- src/index.ts is the starting point of the app where main function App is defined.

- public/index.html is the entry point to the web application
- public/static/bundle/script.js - contains the compiled JS code by webpack.
- public/static/css/style.css - contains simple styling for the main page.

- tsconfig.json - contains typescript configuration
- webpack.config.js - contains webpack configuration

- package.json - contains info about this application and the dependencies involved

### Some Future Work / Improvments Needed

- Better handling of errors.
- Code refactoring with removal of repetitive code
- More complex test scenarios and robust unit testing.

## Project Description - Design Decisions and Assumptions.

This issue tracker app is a very simple solution with no UI and is built using Typescript.
No data is persisted for the "issues" and "users". To store issues and users data two arrays
are initialized in the "src/index.ts". For clean code and separation purposes all the operations related
to issue creation, removal, updating, setting parent are defined in "src/IssueOperations.ts" and all the operations
related to user creation, removal and getting are defined in "src/UserOperations.ts".

To generate unique IDs for Users and Issues (so that they can be identified by those ids) a helper function is
defined in "src/helpers/util.ts" named "getUniqueID" which just takes current time and add a random number with it.

For data representation, User is represented by

```
User {
  id: string,
  name: string,
  createdAt: number
}

```

and Issue is represented by

```
Issue {
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

```

One assumption made is that each issue have a parent and children property, where parent is
the "issueId" and children is array of "issueId". Each time when a parent is assigned to a issue, both
the issue is updated with a parent and the parent of the issue is updated with children.

### TESTING

A simple console testing has been performed for this project. The test code is defined
in App() function inside "src/index.ts".

Defining Unit Tests for testing will be the next improvment for this application.
