FROM node:18

WORKDIR /app

# 1) copia manifest y instala deps (incluye devDeps: typescript)
COPY package*.json ./
RUN npm install --include=dev

# 2) copia el resto
COPY . .

# 3) compila TS -> dist/
RUN npm run build

EXPOSE 3000

# 4) ejecuta el build compilado
CMD ["npm", "run", "start"]
