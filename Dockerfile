FROM node:latest

RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 80

CMD ["bun", "run", "index.js"]