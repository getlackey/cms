# Custom Content Types

Custom content can be managed by creating a controller, model, views and adding the link to the admin interface to the menu bar. There is a scaffold task that helps in this process so minimum Node.js experience is required to do it, although we expect some JS knowledge.

Almost everything in the generated code is optional and can be safely removed or replaced with some other code. You should not consider any of this as *core code*. Only npm modules and some code inside the app/lib folder should be considered core, everything else is up for change.

## Scaffolding

As an example, we will create a products content type.
Open a command line and cd into /app and then run **grunt scaffold**. 

The following message will show: *Which component do you need to create?*
Just press enter to create the full bundle.

Then you will be required the name of the entity. That should be a singular word. We use a pluralisation module to create the plural version where appropriate, according to our own [convention](./coding-conventions.md).

After submitting the name you should see these messages:

```
Running "scaffold" task
? Which component do you need to create? All
? Name of the entity (singular please)? product
Building  All for product
Done, without errors.
```

## The Controller

The default controller will be found in /controller/products, for our example. 

Let's look at some code inside the controller file.

### handlerOptions

This object is used in the REST routes to provide some limits to what values could be used.:

```
handlerOptions = {
    logger: require('../../lib/logger'),
    // NOTE: remember to keep doc/comments in sync
    limit: 100,
    skip: 10000,
    sort: '_id slug createdAt'
};
```

All controllers use the [request handler](https://www.npmjs.com/package/lackey-request-handler) module. It's a good idea to read it's documentation and get comfortable with the available options.

Keeping it modular is the main reason we need to provide a logger instead of pulling that from some global setting.

### CMS

We found it confusing to manage everything visually, straight in the public templates. Some actions like adding/removing content are best performed with a content list. You can see an example of this by pointing your browser to /cms/articles and seeing how it behaves.

You will notice that, in the articles grid, you are only required to provide the article title to create a new document. We are parsing the properties in the model schema and only the required ones will be shown. This form is generated transparently using the [form data](https://www.npmjs.com/package/lackey-form-data) module. 

Not all content types will expose the cms route and that is controlled by the following block:

```
cms.register({
    controller: 'products',
    columns: 'title slug createdAt'
});
```
More info about the cms library can be found in the [lib folder](../app/lib/cms/README.md)

### Swagger comments
Almost all routes in Lackey are RESTfull and should have documentation. We use special comments to generate [swagger](http://swager.io) documentation.

```
/**
 * @swagger
 * resourcePath: /tests
 * description: Manage tests
 */
```

These comments are then parsed by the [swagger docs module](https://www.npmjs.com/package/express-swagger-docs). Visit the module page for full documentation.

### Auth

By default all routes in a new controller will be restricted to either developer or admin users. That is enforced with the [auth library](../app/lib/auth/README.md).

```
router.get('/:id',
    auth.isAny('admin developer'),
    handler(handlerOptions, function (o) {
```
removing the line that calls the auth method will expose that route to anyone. You can also adjust the user groups that are allowed or even use the [ensureLoggedIn](../app/lib/auth/README.md) method to only allow logged in users, no matter what group they belong to.

### getFilter
There is nothing wrong in using document Ids in a REST API, but when that API URL is also the public URL for the website it is useful to have text base slugs that add some SEO value and are easier for humans to manage.

```
.findOne(o.getFilter('id:ObjectId(_id),slug'))
```

The [getFilter](https://www.npmjs.com/package/lackey-request-handler#o-getfilter) method takes care of generating a mongoose query object with one of the options supported - in this case id and slug. Mongoose will throw an error when trying to cast data to an invalid type. To prevent it we need to indicate what property is an ObjectId or any other non-string data.

### ACL

```
.then(Test.checkAcl(o.res.user))
```
This method is used to control access to a document on top of the access to the route. Check the [ACL documentation](./acl.md).

### handleOutput

This is already covered in the [request handler](https://www.npmjs.com/package/lackey-request-handler) documentation but it's a core feature for this CMS.

```
o.handleOutput('html:products/product json')
```

By default, all routes will return an HTML and JSON version. This little method takes care of that. After the **html:** keyword you provide the template name to be used, or any other option like a redirect. You can extend this code and provide additional formats, like XML or even XLSX.

This method also supports the usage of a function to determine which template to use at runtime:

```
o.handleOutput(function(){
	var user = o.res.user;

	if(user && user.is('admin')){
		return 'html:products/product-admin json';
	}

	return 'html:products/product json';
});
```

## getBody and ensureObjectIds

```
o.getBody()
    .then(Test.ensureObjectIds)
```

We try to make our APIs as flexible as possible. We accept data to be provided in several formats and we then convert them to a JSON object. This is covered in the [request handler](https://www.npmjs.com/package/lackey-request-handler) documentation.

There are no joins or foreign keys in MongoDb, but Mongoose adds a nice [Population utility](http://mongoosejs.com/docs/populate.html) to allow some of that. The downside in an API is that the document you just received via GET will not be valid when you try to PUT it back on the server. That document will have a populated document where you should have an ObjectId. 

[ensureObjectIds](https://www.npmjs.com/package/lackey-mongoose-ensure-object-ids) is a mongoose plugin that helps in the process of converting objects back to their ObjectIds. 

### mongooseUtils
We like promises. Mongoose didn't implement promises on every method so we built a [little module](https://www.npmjs.com/package/lackey-mongoose-utils) that exposes them on some methods.

The module also helps us merging data on PUT and PATCH methods as well as supporting Mongoose Populate on nested objects and arrays.

## The Model

The model will be found in /app/models/product. A default model is composed by two files:

- index.js
- product-schema.js

### Model Index
This is the file where we initialise all plugins and define our Mongoose middleware. We try to keep this file clean, with nothing more than references to plugins and middleware functions.

By default we add the following plugins:

- [mongoose-timestamp](https://www.npmjs.com/package/mongoose-timestamp)
- [lackey-mongoose-acl](https://www.npmjs.com/package/lackey-mongoose-acl)
- [lackey-mongoose-slugify](https://www.npmjs.com/package/lackey-mongoose-slugify)
- [lackey-mongoose-version](https://www.npmjs.com/package/lackey-mongoose-version)
- [lackey-mongoose-version](https://www.npmjs.com/package/lackey-mongoose-version)
- [lackey-mongoose-ensure-object-ids](https://www.npmjs.com/package/lackey-mongoose-ensure-object-ids)

If your model will reference other documents it's also a good idea to look into [lackey-mongoose-ref-validator](https://www.npmjs.com/package/lackey-mongoose-ref-validator). This module enforces some foreign keys validation and even prevents the deletion of a document if it's being used as a reference elsewhere. Check the pages and articles models as an example.

Our CMS makes it easy to use multiple database connections. That's why the model need to be registered with **dbs.main.model**. Altough it's easy to use multiple DBs, mongoose will not be able to perform the Populate method and some of the plugins will not work exactly as expected.

### Model Schema
The only convention we have in a model is that, by default, a model schema will have a title and a slug properties. 

If you want to change this, just look at the [lackey-mongoose-slugify] documentation so you can provide the right field for the slug, or just remove the plugin altogether. In the later case also remember to update the controller, removing any reference to the slug property.

Remember that any required property in the schema will be exposed in the CMS form. This is a limitation you have to work with if you want the CMS form to be generated transparently. That is also something you can easily disable. Look at controllers/cms/index to see how we implemented some custom features.

Everything else related to the schema is documented in the [mongoose website](http://mongoosejs.com/).

## Views
Like with the model and the controller, you will find a folder for the views in /app/views/products.

Our views use [dustjs](http://www.dustjs.com/) as the templating system. We currently don't have any support for [context helpers](http://www.dustjs.com/guides/context-helpers/) but everything else should be supported. 

If you need aditional dustjs helpers just drop a file in /app/app-dustjs-helpers.

The scaffolding code generates two view files:

- index.dust - to list all items
- product.dust - to render a single item

We like to keep any partials inside /app/views/_partials/products/ but it's totally up to you how you organise your views.

Check the tutorial on how to create [custom themes](./custom-themes).


