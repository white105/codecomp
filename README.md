# CodeComp

CodeComp is a competive coding platform for developers and coders to test their skills in live competitions. It is currently in the early stages of development and following instructions are aimed at developers.

## Before Reading The Instructions

There is a docker-compose project in the works called codecomp-compose. This compose project encapsulates alot of this knowledge. In general, it's better to leverage codecomp-compose than attempt to run the container in an isolated terminal session as there may be other services that are required for it to function appropriately.

## Using The Docker Container

The Docker container contains a multi-stage build that first installs the dependencies, then builds the project. Whether the output of this build project is actually used depends on your command. The primary container pulls the built app from the "build" directory and places it in "/var/www/app". The rest of the application is stored in "/usr/src/app". In addition, the main container has both nginx and npm installed meaning that you can serve the app using nginx or the built in react-scripts server (`npm start`). Finally, when using nginx, the configuration is dynamically built at run time allowing for some customization in configuration.

This means that you can do the following:

- Serve the built/compiled frontend via nginx and proxy requests to the backend api (written in go) through the same endpoint/port
- Serve the built/compiled frontend via nginx without proxying to the backend api
- Serve the loaded (not-synced) frontend via `npm start`
- Serve the frontend mounted with source code on the host system. This allows for mounting the source as a volume and restarting the app automatically via `npm start` or manually (via refresh) with nginx

The last option is an extremely effective tool in developing within the docker container as you can get immediate (or near immeidate) feedback without rebuilding the container. In addition, there is a project called codecamp-compose which will run all repos together (frontend/nginx, backend api, future services like databases, caches, queues, execution servers). **If the codecamp-compose project is ready for use by developers, use that**.

Before running any of these environments, first build the container.

### Building the Container

```
$ cd /path/to/codecomp/repo;
$ docker build -t white105/codecomp:latest .
```

### Mode 1: Serving via Nginx and Proxying to Go API

Note: This approach assumes you have a backend API running on the same docker network or otherwise accessible to the frontend container. In general, it is better to use docker-compose for this configuraiton.

This is the static build. It's better for when you're doing backend development only or when you're ready to deploy to production.

The majority of the environment variables used below are the default values.

```
$ docker run --rm --name codecomp \
    -e INSECURE_LISTEN_PORT=8080 \
    -e TLS_ENABLED="0" \
    -e DEBUG_CONF="1" \
    -e API_BACKEND_HOST="codecomp-backend" \
    -e API_BACKEND_PORT="8080"\
    -p 8080:8080 white105/codecomp
```

The application will be served on port 127.0.0.1:8080.

### Mode 2: Serving via Nginx without Proxy to Go API

When you do not proxy traffic but stll use nginx, the frontend will still be served, but you will need to specify the backend proxy at docker build time. As the front-end will be static (what is built at docker build time is what you get), you have to use a docker build argument.

**This isnt'a very useful mode**, but if you want, first, build the container with the correct argument. For example, if your API is located at 127.0.0.1:9999 from the host's perspectivate, run:

```
$ cd /path/to/codecomp/repo;
$ docker build \
    --build-arg REACT_APP_API_URL="http://127.0.0.1:9999" \
    -t white105/codecomp:hardcoded .
```

```
$ docker run --rm --name codecomp \
    -e PROXY_ENABLED="0" \
    -e INSECURE_LISTEN_PORT=8080 \
    -e TLS_ENABLED="0" \
    -e DEBUG_CONF="1" \
    -p 8080:8080 white105/codecomp:hardcoded
```

### Mode 3: Serve the Built Frontend via NPM

This mode does not proxy traffic and is not dynamic. Changes to the code will not be immediately seen inside the container. The code that will be run is the code that was copied into the container at build time. It may useful when only doing backend development if you plan on never touching the frontend (otherwise you have to rebuild the container). The API_BACKEND_XX values can be used to set REACT_APP_API_URL inside the container. Assuming you have an API server running on port 9999 from the perspective on the host:

```
$ docker run --rm --name codecomp \
    -e SERVER="npm" \
    -e API_BACKEND_PROTO="http" \
    -e API_BACKEND_HOST="127.0.0.1" \
    -e API_BACKEND_PORT="9999"\
    -e INSECURE_LISTEN_PORT=8080 \
    -p 8080:8080 white105/codecomp
```

The next two options are the most useful for developers. The first allows for running the built in npm server inside the docker container with the source code mounted. Changes will be automatically applied, but the server will not proxy traffic (though you can still set the API_URL value using the API_BACKEND_XX values when it's integrated). The second allows for running nginx with proxying enabled as well "watching" the source code for changes. With this mode, changes are applied on browser refresh.

**Do not mount node_modules inside the container. Sass will most likely fail as the container is alpine. It will 100% failure if you're host is not linux. Therefore, only mount the "src" directory. Others can be mounted indvidually as well, just not node_modules. Rebuild if new packages are added**

### Mode 4: Serve the Dynmic Frontend via NPM with Automatic Refresh

The code should be automatically refreshed. The REACT_APP_API_URL/API_URL value can be set using API_BACKEND_XX options. These values will be combined to create the REACT_APP_API_URL environment variable within the container which will be available as the API_URL within the frontend config.js file. **Notice that "src" is mounted** explicitly and node_modules are ignored. Rebuild container for new packages.

```
$ docker run --rm --name codecomp \
    -e SERVER="npm" \
    -e INSECURE_LISTEN_PORT=8080 \
    -v $(pwd)/src:/usr/src/app/src \
    -p 8080:8080 white105/codecomp
```

### Mode 5: Serve the Dynmic Frontend via Nginx with Manual Refreshes

In this setup, the host's "build" directory is directly mounted inside the container. You have to run "npm run watch" on the host to watch for changes. As should be obvious, this setup just relies on building on the host and syncs the output to the directory which nginx is serving. The API_BACKEND_XX still matter if you plan on proxying traffic throuh nginx. The API_URL (REACT_APP_API_URL) has to be configured from the host.

In addition, the "build" directory cannot be deleted by npm/react or the volume will stop syncing. If you think consecutive builds are causing problems, nuke the "build" directory, restart the watcher, and restart the container (do not need to rebuild container).

**This requires cra-build-watch because react-scripts doesn't support writing to disk**

First, since you will be building the frontend on the host, you need to tell the app where the backend API is. This is done via an environment variable called REACT_APP_API_URL. For example, if the backend is running in a separate session on port 9999, you'd run:

```
$ export REACT_APP_API_URL="http://127.0.0.1:9999"
```

**However**, if you are not running the API on a separate container, but nginx is proxying to it, you'd set the value to the same destination you are serving the app on (from the perspective on the host). Assuming you're listening on 8080 for the app, you'd run.

```
$ export REACT_APP_API_URL="http://127.0.0.1:8080"
```

This second form is unlikely to be the case as you will most likely be using docker-compose in that situation.

Second, run the watcher before starting the container. This ensures the "build" directory exists. This needs to be run in the same session you exported the REACT_APP_API_URL variable in.

```
$ npm run watch
```

**You need to run 'npm run watch' before starting the container to ensure "build" exists**

Third, in a different terminal session, run the app:

```
$ docker run --rm --name codecomp \
    -e PROXY_ENABLED="0" \
    -e INSECURE_LISTEN_PORT=8080 \
    -e TLS_ENABLED="0" \
    -e DEBUG_CONF="1" \
    -v $(pwd)/build:/var/www/app \
    -p 8080:8080 white105/codecomp
```

After each change to the frontend, refresh the pages.

### Environment Variables

```
PROXY_ENABLED:
When set to "1", nginx will proxy API traffic to the backend API. This requires the other variables to be set appropirately and for the API to be available to the docker container (i.e. on the same docker network or used in docker-compose). When set to "0", nginx will not proxy traffic and only serve the main app.

SERVER:
This value can be set to "nginx" or "npm". When set to nginx, the nginx server is run and the config is dynamically generated based on other values. When set to "npm", `npm start` is used to start the server. $INSECURE_LISTEN_PORT is still used with npm start. In addition, the code is run from /usr/src/app, not /var/www/app, meaning that you can mount volumes at /usr/src/app to get automatic reloading of the npm server.

SECURE_LISTEN_PORT:
This value tells nginx which port to listen on for TLS traffic. When TLS_ENABLED is set to "0", it doesn't really matter. When the "npm" $SERVER is used, it is also ignored.

INSECURE_LISTEN_PORT:
This value is used for both the "nginx" and "npm" server types. For "nginx", it tells nginx which port to listen on for non-tls traffic. When TLS_ENABLED is set to "0", this is the port of the main app. When TLS_ENABLED is set to "1", nginx still listens on this port but redirects to $SECURE_LISTEN_PORT. For the "npm" server, this value is exported in the environment as $PORT so that react scripts will listen on that port.

TLS_ENABLED:
This value current defaults to 0, though that may change so it useful to set it "0" when developing. It tells nginx whether to use TLS. When in use, TLS_DIR must be set appropriately. The backend API does not need to be using TLS as nginx can proxy over insecure channels. When set, nginx will also redirect $INSECURE_LISTEN_PORT to $SECURE_LISTEN_PORT. Assumes $SERVER is set to "nginx"

API_BACKEND_PROTO:
The API_BACKEND_PROTO should be set to "http" or "https". When nginx proxies to the backend API, this value determines what protocol to use.

API_BACKEND_HOST:
This value tells nginx which destination (IP/Domain Name) to proxy API requests to. Assumes $SERVER is set to "nginx"

API_BACKEND_PORT:
This value tells nginx which port the backend API listens on. Assumes $SERVER is set to "nginx"

DEBUG_CONF:
When this value is set to "1", the dynamically built nginx.conf will be output to stdout on startup. This assumes $SERVER is set to "nginx".

TLS_DIR:
The TLS_DIR variables points to the folder (within the container) that contains the TLS certifications and keys. To work, fullchain.pem and privkey.pem must exist. Most likely, this folder or these files will be mounted via a volumn in production

```

### Available NPM Commands

```
$ npm start
$ npm test
$ npm run build
$ npm run watch
$ npm run eject
```
