FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY public ./public
ENV NODE_ENV=production PORT=3000 BACKEND_URL=http://backend:3001
EXPOSE 3000
CMD ["node", "server.js"]
