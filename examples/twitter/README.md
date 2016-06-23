## Getting Started

Before running the application make sure that you have installed all dependencies for both the `react-redux-fetch` library and this application.

```sh
git clone git@github.com:flowcommerce/react-redux-fetch.git
cd react-redux-fetch
npm install
cd examples/twitter
npm install
```

After all dependencies are installed the `react-redux-fetch` library should build automatically as part of the NPM lifecycle. If not, you should run the `npm run build` command from the library's root directory.

Lastly, you will need to create a Twitter application to obtain a **consumer key** and **consumer secret** and provide that information to the application by creating a `./server/config/twitter.json` file in the following format:

```json
{
  "consumerKey": "[YOUR CONSUMER KEY]",
  "consumerSecret": "[YOUR CONSUMER SECRET]"
}
```
