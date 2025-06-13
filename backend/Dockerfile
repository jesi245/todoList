# Usar una imagen oficial de Node.js ligera
FROM node:18-alpine

# Crear directorio de la app dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de backend
COPY . .

# Exponer el puerto que usa la app (3000)
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "start"]
