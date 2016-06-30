## Getting Started

Before running the application make sure that you have installed all dependencies for both the `redux-fetch` library and this application.

```sh
git clone git@github.com:flowcommerce/redux-fetch.git
cd redux-fetch
npm install
cd examples/twitter
npm install
```

After installing all dependencies, you will need to create a Twitter application to obtain a **consumer key** and **consumer secret** and provide that information to the application by creating a `./server/config/twitter.json` file in the following format:

```json
{
  "consumerKey": "[YOUR CONSUMER KEY]",
  "consumerSecret": "[YOUR CONSUMER SECRET]"
}
```
