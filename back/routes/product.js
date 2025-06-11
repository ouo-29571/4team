const express = require("express");
const router = express.Router();
const mariadb = require("mariadb");

// DB 연결 풀
const pool = mariadb.createPool({
  host: "192.168.0.191",
  user: "4team",
  password: "4team",
  database: "4team",
  port: 3306,
  bigIntAsNumber: true, // ⭐️ 이거 추가!
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
  const rows = await conn.query(
    "SELECT likes FROM product WHERE product_id = ?",
    [id]
  );
  conn.release();

  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
  } else {
    res.json(rows[0]);
  }
});

// 상품 찜 수 증가
router.post("/api/products/:id/like", async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    // 1) 찜 수 증가
    await conn.query(
      `UPDATE product
         SET likes = IFNULL(likes, 0) + 1
       WHERE product_id = ?`,
      [id]
    );

    // 2) 변경된 likes 값 조회 — **여기만 rows로 받고** rows[0]에 접근!
    const rows = await conn.query(
      "SELECT likes FROM product WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 3) 최종 응답
    res.json({ success: true, likes: rows[0].likes });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  } finally {
    conn.release();
  }
});

// ---------------------------------------------------------------------------------------------------
// 상품평 평점 조회
router.get("/api/products/:id/rating", async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();

    // 1) 평균 평점과 개수
    const [avgRow] = await conn.query(
      `SELECT AVG(rating) AS avg, COUNT(*) AS cnt 
       FROM product_ratings
       WHERE product_id = ?`,
      [id]
    );
    console.log("평균 평점 및 개수:", avgRow);
    //아이디 로그인시 아이디 넘버 설정되는 ..
    const userId = req.user?.id || req.query.userId || 1;
    const [userRow] = await conn.query(
      `SELECT rating 
       FROM product_ratings
       WHERE product_id = ? AND user_id = ?`,
      [id, TEST_USER_ID]
    );
    console.log("사용자 평점:", userRow);
    res.json({
      avgRating: avgRow?.avg ? parseFloat(avgRow.avg).toFixed(1) : 0,
      reviewCount: avgRow?.cnt || 0,
      userRating: userRow?.rating || 0,
    });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "별진행 안됨" });
  } finally {
    if (conn) conn.release();
  }
});

// 상품평 등록 API
router.post("/api/products/:id/rating", async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.user?.id || 1; // 추후 인증 미들웨어 연결시 req.user.id로

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      `INSERT INTO product_ratings (product_id, user_id, rating, created_at)
   VALUES (?, ?, ?, NOW())
   ON DUPLICATE KEY UPDATE rating = VALUES(rating), created_at = NOW()`,
      [id, userId, rating]
    );

    console.log("평점 등록 결과:", result);
    res.json({ success: true });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Database error" });
  } finally {
    if (conn) conn.release();
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
