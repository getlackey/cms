# CMS

Helps by exposing an entity at /cms/entity-name

```
var cms = require('lib/cms');
cms.register({
    controller: 'components',
    columns: 'title modelNumber family subFamily createdAt'
});
```