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

// 회원가입 처리(이 부분 각자 수정 지우고 수정)
// router.post('/', async (req, res) => {
//    const { Signup_email, Signup_password, Signup_name, Signup_tel } = req.body;
//    const conn = await pool.getConnection();
//    const result = await conn.query(
//        'INSERT INTO user(email, password, name, tel) VALUES(?, ?, ?, ?)',
//        [Signup_email, Signup_password, Signup_name, Signup_tel]
//    );
//    conn.release();
//    res.json({ signup_check: result.affectedRows > 0 });
//});


module.exports = router;