# Managing Users
Default group permissions are hardcoded into the CMS code. They should only be changed if you are extending this CMS. 

Group permissions is usually used to control access to a REST route or template. For document based access control we have added a basic [ACL](./acl.md) feature.

## Editing the groups file

User groups are managed in a JSON file in /app/models/user/groups.json

There are 2 special user groups: 

- admin
- developer

These groups should not be deleted but feel free to change the value of the property. That will be the string used as label in website.

If you need additional groups of users just add them to this file but, by default, they will have no special permissions.

## Adding permissions to new Groups

### The auth Library

If you look at the files in the controllers folder you will find something like this:

```
router.post('/',
    auth.isAny('admin developer'),
    handler(handlerOptions, function (o) {
    (...) 
```

The Auth library is an express middleware. It transparently accesses the user object (o.res.user) and calls the available methods there:

- is(group)
- isAny('group1 group2 ... groupN')

An HTTP 401 or a 403 will be thrown depending on the case. Either way the following functions registered in that route will not be run unless we have a valid user.

### The user Object
If you need to add special validations inside a controller, depending on the user group this is how you should do it:

```
router.post('/',
    auth.isAny('admin developer'),
    handler(handlerOptions, function (o) {
		var user = o.res.user;
		
		if(user && user.isAny('admin developer')){
			// add your special code in here...
		}
	});
```
