# Error Handling

Redux Fetch uses [`Promise.all`](https://mzl.la/29uN1k8) to wait until data requirements for route components matching a specific location are fulfilled. Therefore, the first rejected promise will indicate that data requirements cannot be fulfilled.

It's up to you to decide what is considered an error in your application. For example, you may choose to reject on API responses outside the 2xx status code range or to never reject and store API errors and/or runtime errors that occur into the Redux store.

Redux Fetch assumes that the first argument passed into its rejection handler
is the error that occured and will store that into your Redux store by
dispatching a `@@fetch/FETCH_FAILURE` action. Therefore, you should aggregate
any information you want into the first argument of your rejection.
