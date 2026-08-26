FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY calc.js store.js server.js ./
RUN mkdir -p /data
ENV NODE_ENV=production PORT=3001 DATA_DIR=/data
EXPOSE 3001
CMD ["node", "server.js"]
