# JSON-RPC 
Submits RPC FORM request as AJAX.

## Usage
Create a form with ALL required properties. The form SHOULD have the class **json-rpc**.

```
<form class="json-rpc" action="class-pdfs/" method="POST">
	<input type="hidden" name="jsonrpc" value="2.0" />
	<input type="hidden" name="params[id]" value="{itemId}">
	<input type="hidden" name="method" value="renderOne">
	
	<button type="submit" name="params[type]" value="type1">Type 1</button>
	<button type="submit" name="params[type]" value="type2">Type 2</button>
</form>
```

Then call the js function.

```
var jsonRPC = require('./json-rpc');
jsonRPC();
```

## Options
The method can be called several times but keep in mind that any items affected by the selectors will run as many times as the function was called, possibly sending the RPC request more than once.

```
jsonRPC(:options)
```

Being options an object with the following properties:

### selector
By default a **form.json-rpc** selector will be used if none is provided. 
```
jsonRPC({
	selector: 'form.json-rpc'
});
```

### onSuccess
By default, a success alert will be shown. 
```
jsonRPC({
	onSuccess: function (event) {
		alert('Request received successfully');
	}
});
```

### onError
By default, an error alert will be shown. 
```
jsonRPC({
	onError: function (event) {
		alert('There was an error with the request');
	}
});
```