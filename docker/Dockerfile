FROM nginx:alpine
## Copy our default nginx config
COPY /docker/default.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy web app files to nginx
COPY /dist/expense-tracker-ui/browser /usr/share/nginx/html
