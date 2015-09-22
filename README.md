# Intro
Lackey CMS... Visual (WYSIWYG) editor and site builder powered by a REST API.

# Instalation
Lackey relies on Node.js and MongoDb. You should install these first. 
[check the instalation tutorial](./docs/instalation.md)

# What is already available
Lackey comes with a basic website/blog structure. You can easily add custom content types, but the ones already present should allow you a lot of flexibility.


Lackey comes with:

 - Users
 - Dashboard
 - Pages
 - Articles
 - Shared Content
 - Menus
 - Media
 - Tags

[How to use these content types](./docs/content-types.md)

# Themes and Plugins
We believe that NPM is a very decent plug-in manager. There is no need to create another layer of complexity in this tool.

Lackey is not one of these tools where you have to be careful with the core folders. Most of what makes Lackey's core is installed in the node_modules folder and managed through NPM. Everything else should be adjusted to suit your custom website needs.

Read more on how to [create a custom theme](./docs/custom-themes.md)

# REST API
If you need to integrate any tool with your website, Lackey makes it easy for you. The full website **is** an API and you can just add .json or .htm(l) to the end of any url to get it in that specific format. 

You can access the full API documentation, that follows the [Swagger Spec.](http://swagger.io/) by going to /swagger.json in your website. We don't yet support any API Docs in HTML but you can just visit the [Swagger UI](http://petstore.swagger.io/) page and paste your swagger.json url on the main input box to access the full sandbox and documentation.

Read more about the [REST API and Authentication](./docs/rest.md)
