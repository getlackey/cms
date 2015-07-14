# Load More
Hides load-more buttons if they will return zero results.

Until we are using API-JSON there is no easy way of knowing if there are additional resources in a list. 

This function updates the url so it only fetches one item and does an ajax request. On empty results the button will be removed.

## usage

```
var loadMore = require('./load-more');
loadMore();
```

## options
The method can be called several times but keep in mind that any items affected by the selectors will run as many times as the function was called, possibly sending the request more than once.

```
loadMore(:options)
```

Being options an object with the following properties:

### selector
By default a **a.load-more** selector will be used if none is provided. 
```
loadMore({
	selector: 'a.load-more'
});
```