# CMS

Helps by exposing an entity at /cms/entity-name

```
var cms = require('lib/cms');
cms.register({
    controller: 'components',
    columns: 'title modelNumber family subFamily createdAt',
    hasLocale: true
});
```

## Options

### controller
It's easier to just provide the name of the controller. We need it to generate the api urls

### columns
visible columns in the grid

### hasLocale
Not every entity will be localized. Some examples include: 
  - data-series
  - users

It's value is true, by default. If true a select element will be shown with all available languages. No select will be shown if there is only one available language.

### form
A form object compatible with [lackey-form-data](https://www.npmjs.com/package/lackey-form-data) can be provided. Otherwise, one will be created including only the required fields.