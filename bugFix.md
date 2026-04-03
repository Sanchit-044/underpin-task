While writing tests, I found a few issues where the API behavior didn’t match expected functionality.
Below are the key bugs I identified.

1. Incorrect Pagination Logic

Issue:
Page 1 was skipping the first set of tasks.

Cause:
Offset was calculated as:
page * limit

Fix:
Changed to:
(page - 1) * limit


2. Filtering and Pagination Conflict

Issue:
Using both status and pagination together ignored pagination.

Cause:
Early return logic in the route handler.

Fix:
Applied filtering and pagination sequentially instead of returning early.

3. Status Filtering Allowed Partial Matches

Issue:
Partial values like "do" matched "todo".

Cause:
Used .includes() instead of exact match.

Fix:
Replaced with:
t.status === status


These issues were identified through testing and mainly involved query handling logic. Fixing them improved consistency and reliability of the server.