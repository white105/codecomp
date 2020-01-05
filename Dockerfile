
### Builder Container ### 
FROM alpine:3.10 as build-stage
RUN mkdir -p /usr/src/app && \
    rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* && \
    apk update && \
    apk add --update nodejs npm && \
    npm install react-scripts@2.1.8 -g --silent

WORKDIR /usr/src/app

ENV PATH=/usr/src/app/node_modules/.bin:$PATH 

# copy package.json first to avoid busting docker cache
COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json 

# RUN npm install typescript --silent
RUN npm install --silent

# Copying all files will bust cache (i.e changes in docker-run.sh)
# Manually copy necessary files, allows for mounting volumes (like node_modules/build) for dev as well
COPY ./public /usr/src/app/public
COPY ./src /usr/src/app/src
COPY ./tsconfig.json /usr/src/app/tsconfig.json
COPY ./yarn.lock /usr/src/app/yarn.lock

# TODO: this should be prod, use build arg to include devtools but default to prod
RUN npm run build

### Main Container ###
FROM alpine:3.10

RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* && \
    apk update && \
    apk add --update nodejs npm nginx && \
    npm install react-scripts@2.1.8 -g --silent && \
    mkdir -p /usr/src/app && \
    mkdir -p /usr/src/nginx && \
    mkdir -p /run/nginx && \
    mkdir -p /var/www/app && \
    mkdir -p /etc/letsencrypt/live/codecomp.proxy.docker

# copy the entire source so we can run npm start (dev server)
COPY --from=build-stage /usr/src/app /usr/src/app
# copy just the build to the /var/www/directory
RUN cp -R /usr/src/app/build/* /var/www/app

WORKDIR /var/www/app
RUN chown -R nginx:nginx /var/www/app 

# Environmnet Variables and Ports
EXPOSE 8080 8443 3000

# By default, the start script expects the api to be available
# If running the frontend without an API, set PROXY_ENABLED to 0 and it will not
# include the proxy configuration within nginx.
ENV PROXY_ENABLED="1" \
    SERVER="nginx" \
    SECURE_LISTEN_PORT="8443" \
    INSECURE_LISTEN_PORT="8080" \
    TLS_ENABLED="0" \
    API_BACKEND_PROTO="http" \
    API_BACKEND_HOST="backend" \
    API_BACKEND_PORT="8080" \
    DEBUG_CONF="0" \
    TLS_DIR="/etc/letsencrypt/live/codecomp.proxy.docker" \
    PATH=/var/www/app/node_modules/.bin:$PATH

# dynamically configure configs or user defaults to avoid mounts
COPY ./docker-run.sh /usr/bin/docker-run.sh
RUN chmod +x /usr/bin/docker-run.sh


ENTRYPOINT ["/usr/bin/docker-run.sh"]