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
4. Run `yarn start`
  * For local testing, it is recommended to run `yarn watch` instead

## API Description

* `${API_URI}/profiles`
  * `GET`: retrieves a list of graduate profiles that users may potentially connect with
  * Pagination: work in progress.
* `${API_URI}/connect`
  * `POST`: requests connection with one or more profiles
    * Request body should contain `application/json` with the following fields:
      * `ids`: an array of `salesforceId` to connect with
      * `userEmail`: a valid email address for the user (*not in use yet*)

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
* `id`: String - a unique ID identifying this profile
  * (*this is temporarily named `salesforceId` but will be fixed soon*)
