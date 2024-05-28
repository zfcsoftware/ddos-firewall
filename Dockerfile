# Resmi Node.js imajını kullanarak başlıyoruz
FROM node:latest

# Bunjs'i indirmek için gerekli araçları yükleyin
RUN apt-get update && apt-get install -y curl

# Bunjs'i kurun
RUN curl -fsSL https://bun.sh/install | bash

# Bunjs'i PATH'e ekleyin
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Çalışma dizinini ayarlayın
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalayın
COPY package*.json ./

# Bağımlılıkları Bunjs ile yükleyin
RUN bun install

# PM2'yi global olarak yükleyin
RUN npm install -g pm2

# Uygulama dosyalarını kopyalayın
COPY . .

# Uygulama için gerekli portu açın
EXPOSE 3000

# Uygulamayı PM2 ile cluster mode'da başlatın
CMD ["pm2-runtime", "start", "ecosystem.config.js"]