const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const app = express();
app.set('port', config.port);

// Middleware 설정
app.use(cors());
app.use(express.json());

// Routes 연결
app.use('/users', userRoutes);

// 404 에러 처리
app.use((req, res, next) => {
    res.status(404).json({ error: 'Page not found' });
});

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});