# Water Abstraction Node Test

[![CI](https://github.com/DEFRA/water-abstraction-node-test/actions/workflows/ci.yml/badge.svg)](https://github.com/DEFRA/water-abstraction-node-test/actions/workflows/ci.yml)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-node-test&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-node-test)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-node-test&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-node-test)
[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/water-abstraction-node-test/badge.svg)](https://snyk.io/test/github/DEFRA/water-abstraction-node-test)
[![Licence](https://img.shields.io/badge/Licence-OGLv3-blue.svg)](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

This is a demonstration / test project to investigate using the [node test runner](https://nodejs.org/api/test.html) by the [water-abstraction-team](https://github.com/DEFRA/water-abstraction-team).

## Why Node Test Runner?

We as a team would love to move the [water-abstraction-system](https://github.com/DEFRA/water-abstraction-system) project to use [ECMAScript Modules (ESM)](https://nodejs.org/api/esm.html). The one thing that has held us back is testing. Projects in DEFRA currently use either [Jest](https://jestjs.io/) or [Lab](https://hapi.dev/module/lab/) as their test frameworks (we use **Lab**). There are others, but they all share one thing in common; they don't support ESM natively. For example, ESM support in **Jest** is still marked as [experimental](https://jestjs.io/docs/ecmascript-modules). Typically, they rely on on transpiling your code back to CommonJS and then running tests against the transpiled code.

There's no 'right' way in development. But this feels a bit off to us. Hence our interest in **node test runner**. It is native to Node (no extra dependency), blazingly fast and one of few frameworks offering native ESM support without transpiling. If we switched to **node test runner**, we could claim our project as 100% ESM 🤗

## Current status

At this time **node-test** is looking to be a viable alternative to **Jest** and **Lab**. After migrating a file from **water-abstraction-system** to ESM, the test file we create here is very similar to what we would have done in **Lab**.

All examples we've followed so far use the built-in [node:assert](https://nodejs.org/api/assert.html) module. We didn't hit any blockers when first converting tests. But it doesn't have the expressiveness of [Hapi code](https://hapi.dev/module/code/), and it means every test needs updating.

So, we brought in [chai](https://www.chaijs.com/api/), which **Hapi code** is built from. It works fine with **node-test**, doesn't appear to impact performance, and means in a lot of cases we can do a simple copy & paste of the current test.

The output is similar to **Lab**, and we can see code coverage, though it is a little noisy (see comments below). We can also integrate the code coverage output with SonarCloud.

We've had to call our `test/` folder `specs/` because the ability to configure what is a 'test' is limited in Node v20*. For example, if the folder was called `test/` it would consider _every_ file in it a test. The same limitation applies to code coverage. The good news is these have been vastly improved in Node v22. So, if we were to upgrade before adopting **node-test** we could rename the folder and improve our code coverage reporting.

Another improvement is the use of `.only`. It is in Node v20*, but you have to add it at all levels for it to be applied. Again, Node v22* brings the feature more in line wih how we would use it in **Lab**.

## Prerequisites

Make sure you already have:

- [Node.js v22.*](https://nodejs.org/en/)
- [PostgreSQL v14](https://www.postgresql.org/)

## Installation

First clone the repository and then drop into your new local repo:

```bash
git clone https://github.com/DEFRA/water-abstraction-node-test.git && cd water-abstraction-node-test
```

Our preference is to run the database and API within Docker, so [install Docker](https://docs.docker.com/get-docker/) if you don't already have it.

## Configuration

Any configuration is expected to be driven by environment variables when the service is run in production as per [12 factor app](https://12factor.net/config).

However when running locally in development mode or in test it makes use of the [Dotenv](https://github.com/motdotla/dotenv) package. This is a shim that will load values stored in a `.env` file into the environment which the service will then pick up as though they were there all along.

Check out [.env.example](/.env.example) for details of the required things you'll need in your `.env` file.

Refer to the [config files](config) for details of all the configuration used.

## Initial build

The following will get an environment up and running quickly ready for development. It assumes 2 things

- you have Docker installed
- you are using [VSCode](https://code.visualstudio.com/) for development

Open the project in VSCode and then use the [Command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to access the tasks we have provided in [tasks.json](.vscode/tasks.json)

With the palette open search for **Run test task** and once highlighted select it. From the list that's presented select **⬆️ UP (CMA)**

You should see a new terminal open up and [Docker Compose](https://docs.docker.com/compose/) begin to start building the images. Once that is done it will switch to running the app in docker.

The purpose of the project is to explore using node-test as our test framework, and how best to convert the service to ESM. So, the app does nothing and is not expected to be used.

## Running the tests

To run the unit tests call `npm test`. This is the default test script and will do the following.

- clean the test database of _all_ data then seed any reference data required, for example, regions.
- run the unit tests

The details for each test, a summary, plus code coverage will be output.

### Alternate test scripts

When working locally it is not always necessary to clean and seed the database before each run. For expedience, you can use `npm run test:skip` to get straight to running the test suite.

In CI we call `npm run test:lcov`. This switches the test reporter from the default [spec](https://nodejs.org/api/test.html#test-reporters) to **lcov**, which generates a file test coverage tools can use.

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
