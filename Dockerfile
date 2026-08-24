FROM nginx:alpine

# Copiar HTML estático al servidor Nginx interno del contenedor
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
