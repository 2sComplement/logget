# Log Get

Get all the logs.

## Execution

### Install dependencise
```
yarn
```
### Run dev mode
```
yarn dev
```

## Approach
todo

## Dependencies
todo

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