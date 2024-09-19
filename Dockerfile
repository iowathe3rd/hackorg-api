# Используйте официальный Node.js образ как базовый
FROM node:18

# Установите рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируйте package.json и package-lock.json (или yarn.lock) в рабочую директорию
COPY package*.json ./

# Установите зависимости
RUN npm install

# Копируйте весь проект в рабочую директорию
COPY . .

# Соберите проект
RUN npm run build

# Установите переменную окружения для порта
ENV PORT=3000

# Откройте порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]
