# Auth lib
Exposes middleware functions to use with express. Uses JSON Web Token (JWT)

## Usage
Apply it on any route:

```
    router.get('/',
        auth.isAny('admin developer'),
        function (req, res, next){

        });
```

If the user doesn't belong to the **admin** or **developer** groups an error (HTTP 403) will be returned.

## Available Methods

### ensureLoggedIn()
Only logged in users are allowed. Doesn't matter what group they belong to, as long as they have a valid JWT.

### is(:group)
Only users that belong to the group are allowed

### isAny(:groups)
Only users that belong to any of the groups are allowed. Accepts space separated group names (not compatible with lackey-options-parser).

### checkLoggedIn()
The user shouldn't need to call this method. This method is called transparently by Lackey. 

Checks if the user is logged in (has a valid JWT) and loads the user data into the response and also into DustJs context.

## Utility Functions
The user shouldn't need to call these methods. This methods are called transparently by Lackey. 

### signToken(:data)
Signs the data with the password in the config file and returns a valid token.

### getJwt(:req)
Gets the current JWT from either the cookie, query string or request header. 

Returns **ONLY** the first found token in the following order: 
  - header
  - query
  - cookie

