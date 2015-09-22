# Content Types

Lackey comes with:

 - Users
 - Dashboard
 - Pages
 - Articles
 - Shared Content
 - Menus
 - Media
 - Tags

## Users
Lackey comes with a user management system and [content access control](./acl.md). The default user groups are:

 - developer
 - admin

Developers are some sort of super admins. They are able to change settings that will affect how the website will look. 

Admins have access to the visual tools to manage content.

Everyone else will be an anonymous user.

It's possible to [add additional user groups](./managing-users.md).
By default, users create a new session at /login. If you wish to manually create a session look at the [REST docs](./rest.md)

## Dashboard
The dashboard shows the activity-streams - a list of actions that changed the database. Every time a user adds, updates or deletes a document a trace will be left on this list. As a safety measure a backup of that document is created in the database, ensuring nothing gets lost.

## Pages
Pages compose the majority of a website. By default, pages are created as unpublished and will only be visible to admin users. There is a small icon shaped like an eye on the top bar that has to activated to allow any visitor to see the page. 

A page can have one or more sub pages. We can choose the template to use for a page and which page will be shown as the homepage. Pages can be classified with tags.

We consider that an admin **should not** have the ability to make decisions take will strongly affect the design of a site. A custom website should have a set of pre-defined templates to choose from where the admin user can only fill in the gaps on the template.

See our tutorial on [how to create a custom theme](./custom-themes.md).

## Articles
Articles are similar to pages, but there is no option to choose the template. Articles, like pages, can be classified with tags. 

Articles should be used to add news to a website. Pages should be used on information that don't change often.

Altough you can use articles for other types of data, like list of products or services, it's always a better idea to [create a custom content type](./custom-content-types.md)

## Shared Content
Information that needs to be shared in several pages but shouldn't be saved as either a page or an article. Eg. header and footer messages. The creation/destruction of shared content is restricted to developer users, but any admin user can change it's value.

## Menus
The website comes with a main menu by default. Admins can add/remove links to that menu. Only developer users should be able to create additional menus as they will have to be added to the template code.

## Media
Every file an admin uploads get's registered in the media repo. Only images, pdfs and zip files are supported. There is a limit of 500kb on each file.

## Tags
Tags are helpful to classify content. There are two types of tags:

- system: System Managed
- cms: User Managed



