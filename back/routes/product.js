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

router.get("/api/products", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM product");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM product WHERE product_id = ?", [
    id,
  ]);
  conn.release();

  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
  } else {
    res.json(rows[0]);
  }
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