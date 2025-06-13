# Usar la imagen oficial de nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar todo el contenido del frontend al directorio estándar de nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80 para el servidor web
EXPOSE 80

# No es necesario definir CMD porque nginx ya tiene uno por defecto
