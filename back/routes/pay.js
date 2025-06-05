const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');

// DB 연결 풀
const pool = mariadb.createPool({
    host: '192.168.0.191',
    user: '4team',
    password: '4team',
    database: '4team',
    port: 3306,
});

module.exports = router;