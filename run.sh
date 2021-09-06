for mainFileName in /usr/share/nginx/html/main*.js;
do
        if ! envsubst '${HOME_URL} ' < ${mainFileName} > main.tmp ;
        then
                exit 1;
        fi
        if ! mv main.tmp  ${mainFileName} ;
        then
                exit 1;
        fi
done;
nginx -g 'daemon off;'
