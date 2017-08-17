# Code Fellows Talent - Backend

This is the backend to the Code Fellows Talent project.

## About

The server provides profile data for Code Fellows graduates who desire connection with potential employers and mentors, and the capability for users to request connections with graduates of interest. It pulls data from an automatically generated CSV file, parses it, and serves it as JSON. Using Amazon SES, it emails both the user and a designated Code Fellows account when connections are requested.

## Installation and configuration

1. Clone this GitHub repo.
2. Run `yarn install`.
3. Either with a `.env` file or the host's environment management tool, and add these environment variables:
  * PORT - the port the server should listen on
  * MONGODB_URI - the *root* URL for MongoDB, i.e. `mongodb://localhost` or `mongodb://mongo.server.url`
    * *Note: MongoDB is currently unused and may be removed from the project.*
  * API_URI - the desired URI for the API, for example `/api/v1`
  * AWS_ACCESS_KEY_ID - a valid AWS access key ID
  * AWS_SECRET_ACCESS_KEY - a valid AWS secret access key
  * S3_CSV_URI - the full URL of the CSV the server should consume
    * *Note: despite the name, it need not be hosted on AWS S3.*
  * EMAIL_SOURCE - email source
  * EMAIL_TARGET - target email for notifications sent to Code Fellows
  * AWS_REGION - AWS region where SES is hosted
  * EMAIL_RATE_LIMIT - the minimum time (in ms) between sending emails. Defaults to 60000 ms (1 minute).
  * CACHE_UPDATE_INTERVAL - the minimum time (in ms) between updates of the cache from the remote data source. Defaults to 60000 ms (1 minute).

4. Run `yarn start`
  * For local testing, it is recommended to run `yarn watch` instead

## API Description

* `${API_URI}/profiles`
  * `GET`: retrieves a list of graduate profiles that users may potentially connect with
  * Pagination: via query string:
    * `page=[number]`: which page of results to get
    * `length=[number]`: how many profiles should be on a page
    * `shuffle=true`: request *shuffled* results, in a random order; only required if you do not yet have a `shuffleToken`
    * `shuffleToken=[token]`: request a page of *shuffled* results, given this token. Each token corresponds to an ordering of results. Using the same token for multiple pages will ensure that no profiles are repeated between shuffled pages.
    * **IMPORTANT**: when using `shuffle` or `shuffleToken`, the structure of the data returned is different! It will be:
      * `{ profiles: [Profile], shuffleToken: String }`
      * (In the future, this will be the structure of all profile data returned.)
* `${API_URI}/connect`
  * `POST`: requests connection with one or more profiles
    * Request body should contain `application/json` with the following fields:
      * `ids`: an array of `salesforceId` to connect with
      * `email`: the hiring partner's email
      * `name`: the hiring partner's name
      * `company`: the hiring partner's company
      * All fields are required.
    * Causes emails to be sent to the hiring partner and to a designated Code Fellows account. These emails are rate limited according to the EMAIL_RATE_LIMIT environment variable.

## Profile Description

A profile is a JSON file with the following fields:

* `nickname`: String - the profile's chosen nickname
* `tagline`: String - a brief description chosen by the graduate
* `employer`: String - the graduate's current position and employer, if applicable
* `careerTagline`: String - a brief description of the graduate's prior career
* `coursework`: String - the graduate's prior coursework
* `location`: String - the graduate's current or desired location
* `graduationDate`: String - the date the graduate finished Code 401
* `codeFellowsCourse`: String - the Code 401 course the graduate completed
* `relocation`: Boolean - whether the graduate is open to relocation
* `employmentTypes`:
  * `fullTime, partTime, freelance, apprenticeship, internship`: Boolean - whether the graduate is seeking each particular type of employment
* `skills`:
  * `top`: String - the graduate's self-rated top skill
  * `good, learn`: [String] - skills the graduate knows well, and those the graduate is interested in continuing to learn, respectively
* `tools`:
  * `top`: String - the graduate's self-rated favorite tool
  * `good, learn`: [String] - tools the graduate knows well, and those the graduate is interested in continuing to learn, respectively
* `roles`:
  * `top`: String - the graduate's preferred role
  * `other`: [String] - other roles the graduate is interested in
* `salesforceId`: String - a unique ID identifying this profile
