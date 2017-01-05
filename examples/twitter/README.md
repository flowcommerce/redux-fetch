## Getting Started

Before running this example application you will need to make sure all
dependencies are installed and the environment is configured with your
Twitter consumer secret and key.

### Installing dependencies

To install all dependencies navigate to the root of the project and run the
`npm install` command.

```sh
git clone git@github.com:flowcommerce/redux-fetch.git
cd redux-fetch/examples/twitter
npm install
```

### Configuring environment

You will need to create a Twitter application to obtain a **consumer key**
and **consumer secret**. Instructions to create a Twitter application can be
found at [http://bit.ly/2hWz5X5](http://bit.ly/2hWz5X5).

Once you have created a Twitter application, define two environment variables
with the consumer key and secret.

```sh
export CONF_TWITTER_CONSUMER_KEY=XXXXXXXXXXXXXXXXX
export CONF_TWITTER_CONSUMER_SECRET=XXXXXXXXXXXXXXXXXXXXXX
```

### Running application

To run this application execute the `npm start` command from the root directory
and navigate to `https://localhost:7050` using your favorite browser.
