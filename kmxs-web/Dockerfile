FROM hub.cifi.com.cn/public/nginx:1.18.0
RUN mkdir -p /app
RUN mkdir -p /app/nginx/html/bolm-web
COPY ./nginx.conf /app/nginx/conf/nginx.conf
COPY ./dist /app/nginx/html/
COPY ./dist /app/nginx/html/bolm-web/
EXPOSE 8013
#ENTRYPOINT ["nginx", "-c"]
#CMD ["/app/nginx-1.18.0/conf/nginx.conf"]
