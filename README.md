# Log Get

Gets all the logs.

## Assumptions

* Created for use on any platform, but assumes log files will have unix line endings.
* Used node 16.15.1, but didn't enforce this in `package.json`.

## Execution

Do these things to run the app.

### Install dependencies
```sh
yarn
```

### Build

```sh
yarn build
```

### Run
```sh
yarn start
```

### Run dev environment with watch
```sh
yarn dev
```

### Run the tests
```sh
yarn test
```

### Run docker environment
To run the app in a docker container, first build the docker image (`sudo` may be required):
```sh
# Builds and tags v0.1 of the logget image.
docker build -t logget:0.1 .
```
Then run a container using this image:
```sh
# Bind desired host port to 3100
docker run -p 3101:3100 -d logget:0.1
```
Then hit the app from the host machine on the port exposed by the container (`3101` in the example above):
```sh
curl localhost:3101/logs
```

## Runtime Requirements

* Node v16.15.1
* Yarn
* Docker (optional)

## API Usage

The API was designed to be an intuitive file explorer. It allows clients to both list directory contents, and return file contents.

### List contents
List the contents of the log root or nested folders:
```sh
# Root log directory - /var/log on linux machines
curl localhost:3100/logs

# Nested directories under the root log directory
curl localhost:3100/logs/dir1/dir2
```

### Get/filter logs
Get a log file with optional filtering params:
```sh
# Get the whole file - /var/log/log1.log
curl localhost:3100/logs/log1.log

# Filter the response using the `search` query parameter
curl localhost:3100/logs/log1.log?search=debug

# Specify the last n number of matching entries
curl "localhost:3100/logs/log1.log?search=debug&last=5"

# Specify the last n number of log entries (without a search parameter)
curl "localhost:3100/logs/log1.log?last=5"
```

### Special Characters?

No problem! Just send your request using [UrlEncoding](https://www.w3schools.com/tags/ref_urlencode.ASP)!

For example, to return logs for `/var/log/a file.log`:
```sh
curl "localhost:3100/logs/a%20file.log"
```

## Non-Dev Third Party Libraries
* dotenv
* express

## Notable Dev Third Party Libraries
* prettier - for formatting
* mocha/chai - for unit testing/assertion

## Acceptance Criteria

1. A README file describing how to run and use the service.
2. An HTTP REST API exposing at least one endpoint that can return the lines
requested from a given log file.
3. The lines returned must be presented with the newest log events first. It is safe to
assume that log files will be written with newest events at the end of the file.
4. The REST API should support additional query parameters which include
    1. The ability to specify a filename within /var/log
    2. The ability to filter results based on basic text/keyword matches
    3. The ability to specify the last n number of matching entries to retrieve
within the log
5. The service should work and be reasonable performant when requesting files of > 1GB
6. Minimize the number of external dependencies in the business logic code path.
For example, if implementing your project with Node.js:
a. Feel free to use Express or similar as the HTTP server as well as any of
the built-in Node.js modules like fs.
b. Please do not use external libraries for any file reads or working with the
log lines after you’ve read them. We want to see your solution in this case
using only what Node.js has built-in.