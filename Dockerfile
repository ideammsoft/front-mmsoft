# =========================
# 1. build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# package 파일 먼저 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 프로젝트 전체 복사
COPY . .

# Vite 프로덕션 빌드
RUN npm run build


# =========================
# 2. nginx stage
# =========================
FROM nginx:stable-alpine

# 기본 nginx 정적 파일 제거
RUN rm -rf /usr/share/nginx/html/*

# build 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 기본 포트 80 사용
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]