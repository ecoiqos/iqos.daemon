# API
API is working over HTTP on port `1447`

## Endpoints
* [`/battery` / `http://localhost:1774/battery`](http://localhost:1774/battery)
	* Example Output: (`Initial`)
		* ```json 
			{"holder":null,"case":null}
			```
	* ` holder `
		* If it is `false` the holder is not inside case.
		* ` 100 ` is charged
		* ` 0 ` is charging.
	* ` case `
		* ` from 0 to 100 `: charge.