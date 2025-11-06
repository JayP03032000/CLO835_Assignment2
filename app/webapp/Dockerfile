# Simple Node image for the employees app
FROM public.ecr.aws/docker/library/node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* /app/
RUN npm install --production || npm install --production
COPY . /app
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
