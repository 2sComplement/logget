# Log Get

Gets all the logs.

## Execution

Do these things to run the app.

### Install dependencies
```
yarn
```

### Build

```
yarn build
```

### Run
```
yarn start
```

### Run dev environment with watch
```
yarn dev
```

### Run the tests
```
yarn test
```

### Run docker environment
To run the code in docker, first build the docker image:
```
docker build -t logget:0.1 .
```
Then run a container using this image:
```
docker run -p 3101:3100 -d logget:0.1
```
Then hit the app from the host machine on port `3101`:
```
curl localhost:3101/logs
```

## Runtime Requirements

* Node v16.15.1
* Yarn
* Docker (optional)

## API Usage

### List contents
List the contents of the log root or nested folders:
```sh
# Root log folder
curl localhost:3100/logs

# Nested folders
curl localhost:3100/logs/dir1/dir2
```

### Get/filter logs
Get a log file with optional filtering:
```sh
# Get the whole file
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
```
curl "localhost:3100/logs/a%20file.log
```

## Third Party JS Libraries
* dotenv
* express

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