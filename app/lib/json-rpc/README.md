# JSON-RPC
Express middleware for [JSON-RPC](http://www.jsonrpc.org/specification) over [HTTP](http://www.simple-is-better.org/json-rpc/jsonrpc20-over-http.html)

## usage
We only support HTTP POST requests. Add the RPC definition to any Express endpoint.

```
router.post('/', rpc({
    renderAll: function (params, next) {
    	var data = {};

    	// if error:
        // return next(rpc.errors.parseError('Oops'));

		data = {
            'status': 'OK'
        };
        next(null, data);
    }
}));
```

## REST and RPC on the same endpoint
If a request object does not include the **jsonrpc** property it will not be considered an RPC request and next will be called.

```
router.post('/', 
	// RPC handler
	rpc({
	    renderAll: function (params, next) {
	        // next(rpc.errors.parseError(''));
	        next(null, {
	            'status': 'OK'
	        });
	    }
	}),
	//REST handler
	function (req, res, next) {
		// ...
	}
);
```

## TODO
Batch
Improve error messages with argument validation and proper HTTP code
allow content-type/accept as application/json-rpc or application/jsonrequest?
supporting [Extensions](https://jsonrpcx.org/)?
support GET?
detect it's an RPC request not only by the presence of jsonrpc but also by the content-type