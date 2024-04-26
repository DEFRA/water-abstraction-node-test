# Water Abstraction Node Test

![Build Status](https://github.com/DEFRA/water-abstraction-node-test/workflows/CI/badge.svg?branch=main)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-node-test&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-node-test)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-node-test&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-node-test)
[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/water-abstraction-node-test/badge.svg)](https://snyk.io/test/github/DEFRA/water-abstraction-node-test)
[![Licence](https://img.shields.io/badge/Licence-OGLv3-blue.svg)](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

This is a demonstration / test project to investigate using the [node test runner](https://nodejs.org/api/test.html) by the [water-abstraction-team](https://github.com/DEFRA/water-abstraction-team).

## Why Node Test Runner?

We as a team would love to move the [water-abstraction-system](https://github.com/DEFRA/water-abstraction-system) project to use [ECMAScript Modules (ESM)](https://nodejs.org/api/esm.html). The one thing that has held us back is testing. Projects in DEFRA currently use either [Jest](https://jestjs.io/) or [Lab](https://hapi.dev/module/lab/) as their test frameworks (we use **Lab**). There are others, but they all share one thing in common; they don't support ESM natively. For example, ESM support in **Jest** is still marked as [experimental](https://jestjs.io/docs/ecmascript-modules). Typically, they rely on on transpiling your code back to CommonJS and then running tests against the transpiled code.

There's no 'right' way in development. But this feels a bit off to us. Hence our interest in **node test runner**. It is native to Node (no extra dependency), blazingly fast and one of few frameworks offering native ESM support without transpiling. If we switched to **node test runner**, we could claim our project as 100% ESM 🤗

## Running the project

Like **water-abstraction-system** this project expects to be run within the WABS ecosystem of apps. For example, when installing we only expect you to create the test DB because if it were to run, it would do so against the existing WABS database.

It is built with a focus on running the tests, not on being a working app. But should you wish to this README provides details on what you'll need.

## Prerequisites

Make sure you already have:

- [Node.js v16.*](https://nodejs.org/en/)
- [PostgreSQL v12](https://www.postgresql.org/)

## Installation

First clone the repository and then drop into your new local repo:

```bash
git clone https://github.com/DEFRA/water-abstraction-ava.git && cd water-abstraction-ava
```

You'll need to manually create a test database in PostgreSQL plus a user that can access them. Once [configured](#configuration) you can then run `npm migrate:db:test`.

Our preference is to run the database and API within Docker, so [install Docker](https://docs.docker.com/get-docker/) if you don't already have it.

## Configuration

Any configuration is expected to be driven by environment variables when the service is run in production as per [12 factor app](https://12factor.net/config).

However when running locally in development mode or in test it makes use of the [Dotenv](https://github.com/motdotla/dotenv) package. This is a shim that will load values stored in a `.env` file into the environment which the service will then pick up as though they were there all along.

Check out [.env.example](/.env.example) for details of the required things you'll need in your `.env` file.

Refer to the [config files](config) for details of all the configuration used.

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
