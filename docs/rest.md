# REST API and Authentication

## Authentication

We use a token based authentication on top of [JSON Web Tokens](http://jwt.io/). The token needs to be provided with every request.

## Creating a new Session
            
To create a new session issue a POST request to {baseUrl}/sessions providing your email and password:

```
curl -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d '{"email": "{user.email}", "password": "XXXXXXXXXX"}' {baseUrl}/sessions
```

**Please, remember to replace your password.**

You should receive an object with two properties - payload and token. The payload is a non encrypted version of the token. It is usefull only for reference and doesn't grant you access in any request. The token property is what we need to provide on every request. By default, sessions are valid for 5 hours.

## Media Types

This API responds with the following media types on most routes:

- text/html
- application/json

Use the appropriate [Accept header](http://www.w3.org/Protocols/HTTP/HTRQ_Headers.html#z3). If no header is provided the API should reply in text/html which is useful for browser preview but may not be so useful when consuming the API in another application.

Data can be provided in any of these formats:
- application/x-www-form-urlencoded
- application/json
- multipart/form-data

Only one JSON file uploaded in multi part requests will be accepted and decoded. Properties in the file will be ignored if they are provided in the request body.
            
## Making a Request

In order to perform a successful request on any API route that requires authentication a valid access token should be provided. Token can be provided as a cookie, header or in the url querystring. Remember to always use HTTPS on your requests. HTTP requests will be redirected but by then your token may already have been compromised.

Cookies are usually used for the text/html responses as they really simplify the process. The new session request answers with the cookie header that creates the cookie by default. The token name is jwt.

Url Querystring is the easier method for authentication. Just provide the token in the querystring as jwt.

```
curl -X GET -H "Accept: application/json" {baseUrl}/api/v1/users?jwt=XXXXXXXXXXXX
```

**Please remember to replace your password.**