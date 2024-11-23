# Node.js 베이스 이미지 사용
FROM node:latest

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 포트 설정
EXPOSE 9999

# 애플리케이션 실행
CMD ["node", "index.js"] 