#!/bin/sh

# need to posix compliant to use sh 

set -e;

if [ ${#INSECURE_LISTEN_PORT} -lt 2 ]; then
    INSECURE_LISTEN_PORT="8080";
fi

if [ ${#SECURE_LISTEN_PORT} -lt 2 ]; then
    SECURE_LISTEN_PORT="8443";
fi

if [ ${#API_BACKEND_PROTO} -lt 2 ]; then
    API_BACKEND_PROTO="http";
fi

if [ ${#API_BACKEND_HOST} -lt 2 ]; then
    API_BACKEND_HOST="127.0.0.1";
fi

if [ ${#API_BACKEND_PORT} -lt 2 ]; then
    API_BACKEND_PORT="8080";
fi

NGINX_PREFIX=$(cat << EOF 
user nginx;
worker_processes 1;
error_log /dev/stderr warn;
events {
    worker_connections 1024;
}
EOF
)

NGINX_HTTP_BLOCK_CONTENTS_GLOBALS=$(cat << EOF 
    server_names_hash_bucket_size   64;
    server_tokens                   off;
    sendfile                        off;
    include mime.types;
    default_type application/octet-stream;
    proxy_buffering off;
    proxy_buffer_size 4k;
    proxy_read_timeout 300s;
    reset_timedout_connection on;
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
            '\$status \$body_bytes_sent "\$http_referer" '
            '"\$http_user_agent" "\$http_x_forwarded_for"';
    access_log /dev/stdout main buffer=16k;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    # TODO: add CSP
EOF
)

NGINX_LOCATION_FRONTEND_BLOCK=$(cat << EOF
        location / {
            try_files \$uri /index.html =404;
        }
EOF
)

NGINX_TLS_OPTIONS=$(cat << EOF 
        ssl on;
        ssl_certificate $TLS_DIR/fullchain.pem;
    	ssl_certificate_key $TLS_DIR/privkey.pem;
        # Improve HTTPS performance with session resumption
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        # Enable server-side protection against BEAST attacks
        ssl_protocols TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
        # ssl_dhparam /etc/ssl/ffdhe4096.pem;
EOF
)

if [ "cmd" != "$SERVER" ]; then 
    mode="$SERVER"
    if [ "nginx" = "$mode" ]; then
        if [ "1" = "$PROXY_ENABLED" ]; then 
            NGINX_HTTP_UPSTREAM_BLOCK=$(cat << EOF
    upstream api_backend  {
        server $API_BACKEND_HOST:$API_BACKEND_PORT;
    }            
EOF
)
            NGINX_LOCATION_API_BLOCK=$(cat << EOF
        location /api {
            gzip off;
            client_max_body_size '0';
            proxy_pass $API_BACKEND_PROTO://api_backend/api;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }        
EOF
)
        else
            NGINX_HTTP_UPSTREAM_BLOCK=""
            NGINX_LOCATION_API_BLOCK=""
        fi

        if [ "0" = "$TLS_ENABLED" ]; then 
            NGINX_SERVER_BLOCKS=$(cat << EOF
    server {
        listen $INSECURE_LISTEN_PORT;
        root /var/www/app;
        index index.html;
$NGINX_LOCATION_API_BLOCK
$NGINX_LOCATION_FRONTEND_BLOCK

    }
EOF
)
        else 
            NGINX_SERVER_BLOCKS=$(cat << EOF
    server {
        listen $INSECURE_LISTEN_PORT default_server;
        return 301 https://\$host:$SECURE_LISTEN_PORT\$request_uri;
    }
    server {
        listen $SECURE_LISTEN_PORT;
        root /var/www/app;
        index index.html;
$NGINX_TLS_OPTIONS
$NGINX_LOCATION_API_BLOCK
$NGINX_LOCATION_FRONTEND_BLOCK

    }
EOF
)
        fi
        NGINX_HTTP_BLOCK_CONTENTS=$(cat << EOF
$NGINX_HTTP_BLOCK_CONTENTS_GLOBALS
$NGINX_HTTP_UPSTREAM_BLOCK
$NGINX_SERVER_BLOCKS
EOF
)
        NGINX_HTTP_BLOCK=$(cat << EOF 
http {
$NGINX_HTTP_BLOCK_CONTENTS
}
EOF
)
        NGINX_CONF=$(cat << EOF
$NGINX_PREFIX
$NGINX_HTTP_BLOCK 
EOF
)
        if [ "1" = "$PROXY_ENABLED" ]; then
            echo "Using Proxy API URL: ${API_BACKEND_PROTO}://${API_BACKEND_HOST}:${API_BACKEND_PORT}";
        else
            echo "Backend Proxying diabled in Nginx mode. API_URL will be default or whatever was set at build time";
        fi

        # sudo is unavailable within alpine, don't drop privs inside Dockerfile
        # Nginx will run as root, but workers will run as "nginx" user
        echo "$NGINX_CONF" | tee /etc/nginx/nginx.conf >/dev/null
        if [ "1" = "$DEBUG_CONF" ]; then
            echo "Nginx Configuration:"
            cat /etc/nginx/nginx.conf;
        fi
        exec nginx -g "daemon off;";
    elif [ "npm" = "$mode" ]; then 
        cd /usr/src/app;
        # port which npm will listen on, needs to be exposed
        export PORT=$INSECURE_LISTEN_PORT;

        # setup the API_URL which frontend code will use as npm will not proxy
        ## for 80/443, don't append port
        if [ "80" = "${API_BACKEND_PORT}" ]; then 
            API_URL="${API_BACKEND_PROTO}://${API_BACKEND_HOST}"
        elif [ "443" = "${API_BACKEND_PORT}" ]; then 
            API_URL="${API_BACKEND_PROTO}://${API_BACKEND_HOST}"
        else
            API_URL="${API_BACKEND_PROTO}://${API_BACKEND_HOST}:${API_BACKEND_PORT}"
        fi
        echo "Using Direct API URL: $API_URL";
        export REACT_APP_API_URL="${API_URL}"
        exec npm start
    else 
        echo "No valid server mode found for $mode" >&2;
        exit 1
    fi
else
    exec "$@"
fi