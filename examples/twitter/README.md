## Getting Started

Before running this example application you will need to make sure all
dependencies are installed and the application is configured with your
Twitter consumer secret and key.

### Installing dependencies

To install all dependencies navigate to the root of the project and this
application and run the `npm install` command.

```sh
git clone git@github.com:flowcommerce/redux-fetch.git
cd redux-fetch
npm install
cd examples/twitter
npm install
```

### Configuring application

You will need to create a Twitter application to obtain a **consumer key**
and **consumer secret**. Instructions to create a Twitter application can be
found at [https://apps.twitter.com/](https://apps.twitter.com/).

Once you have created a Twitter application, create a
`./server/config/twitter.json` file in the following format:

```json
{
  "consumerKey": "[YOUR CONSUMER KEY]",
  "consumerSecret": "[YOUR CONSUMER SECRET]"
}
```

Note that this file is configured to be automatically ignored by Git.

### Running application

To run this application execute the `npm start` command from the root directory
and navigate to `https://localhost:7050` using your favorite browser.
