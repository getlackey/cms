# Janitor
Cleaning up the database

The janitor process will run a list of tasks that check collections and ensure consistency.

Usually it only runs after a couple of minutes after the update. This delay is meant to prevent the update to happen while the admins are still submitting data. 

Information about the state of the updates is provided at the /janitor endpoint

