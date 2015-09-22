# ACL

We have basic access control on documents. At this moment the behaviour is there but we haven't built the interface that allows the management of grants - this is only available via the API.

Visit the [ACL module](https://www.npmjs.com/package/lackey-mongoose-acl) page to learn more about it's usage.

## How it works
Each user has a special array called **grants**. There we add a list of keywords, similar to tags, we call grants. Think of them as special, ad hoc, user groups.

The same grants property should also be available in any document. 

When a user requests data from the API we compare the user grants with the document ones and only return documents that have at least a matching grant.

