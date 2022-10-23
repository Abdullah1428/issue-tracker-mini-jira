import { IssueType } from "../helpers/types";
import { addIssue } from "../IssueOperations";

// Not adding any more units tests due to time constraint

test('should add issue to the list of issues', () => {
  const title = 'Test-Bug';
  const type = IssueType.TASK;

  const issueId = addIssue(title, type);
  expect(typeof issueId).toBe('string');

})