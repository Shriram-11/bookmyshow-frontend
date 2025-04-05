#!/bin/sh
# entrypoint.sh

CONFIG="window.APP_CONFIG = {"
first_var=true
for var in $(env | grep -vE '^(HOME|PATH|PWD|K_|PORT|CLOUD_RUN_|NGINX_|NJS_|PKG_|DYNPKG_)'); do
  var_name=$(echo "$var" | cut -d'=' -f1)
  var_value=$(echo "$var" | cut -d'=' -f2-)
  var_value=$(echo "$var_value" | sed 's/"/\\"/g')
  if [ "$first_var" = "true" ]; then
    first_var=false
  else
    CONFIG="$CONFIG,"
  fi
  CONFIG="$CONFIG \"$var_name\": \"$var_value\""
done
CONFIG="$CONFIG};"

# Log the config for debugging
echo "Generated config.js content: $CONFIG" >&2

# Write to config.js
echo "$CONFIG" > /usr/share/nginx/html/config.js

# Log file creation
if [ -f /usr/share/nginx/html/config.js ]; then
  echo "config.js created successfully" >&2
  cat /usr/share/nginx/html/config.js >&2
else
  echo "Failed to create config.js" >&2
fi

nginx -g 'daemon off;'
