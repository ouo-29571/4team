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
});

router.post("/cart/user_id", async (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;
  console.log(user_id, product_id, quantity, price);
  return res.json({ success: true });
});

// ✅ 장바구니 전체 조회 + 요약 계산
router.post("/personalCart", async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  if (!user_id) return res.status(400).json({ error: "user_id 필요" });
  try {
    const conn = await pool.getConnection();

    const cartRows = await conn.query(
      `
        SELECT 
        cart.cart_id AS id, 
        cart.quantity, 
        cart.price, 
        product.product_name AS name,
        product.product_id
        FROM cart
        JOIN product ON cart.product_id = product.product_id
        WHERE cart.user_id = ?
    `,
      [user_id]
    );

    const totalPrice = cartRows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = cartRows.length > 0 ? 1000 : 0;
    const delivery = totalPrice === 0 ? 0 : totalPrice < 30000 ? 3000 : 0;
    const finalPrice = totalPrice - discount + delivery;

    res.json({
      cart: cartRows,
      summary: { totalPrice, discount, delivery, finalPrice },
    });

    conn.release();
  } catch (err) {
    console.error("장바구니 조회 실패:", err);
    res.status(500).send("서버 오류");
  }
});

// 할인정보 가져오기
router.get("/discounts", async (req, res) => {
  const user_id = Number(req.query.user_id);
  if (!user_id) {
    return res.status(400).json({ error: "로그인 필요" });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
            uc.user_coupon_id,
            uc.status,
            d.name, 
            d.discount, 
            d.discount_type
        FROM user_coupon AS uc
        JOIN discount AS d ON uc.discount_id = d.discount_id
        WHERE
            uc.user_id = ?
            AND uc.status = 'active'`,
      [user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("할인 목록 불러오기 실패:", err);
    res.status(500).json({ error: "서버 오류" });
  } finally {
    if (conn) conn.release();
  }
});

router.get("/users/:userId/coupons", async (req, res) => {
  const userId = Number(req.params.userId);
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
            SELECT d.discount_id, d.name, d.discount, d.discount_type
            FROM user_coupon uc
            JOIN discount d ON uc.discount_id = d.discount_id
            WHERE uc.user_id = ? AND uc.status = 'active'
            `,
      [userId]
    );
    res.json(rows);
  } catch (er) {
    console.error("쿠폰 조회 실패:", err);
    res.status(500).json({ error: "server error" });
  } finally {
    conn && conn.release();
  }
});

router.post("/coupon", async (req, res) => {
  const { user_id, discount_id, status } = req.body;
  if (!user_id || !discount_id)
    return res.status(400).json({ error: "user_id, discount_id 필요" });

  let conn;
  try {
    conn = await pool.getConnection();

    // 1) 이미 발급된 쿠폰인지 체크
    const rows = await conn.query(
      `SELECT user_coupon_id 
            FROM user_coupon 
            WHERE user_id = ? 
            AND discount_id = ?`,
      [user_id, discount_id]
    );

    if (rows.length > 0) {
      // 이미 있으면 409 Conflict 로
      return res.status(409).json({
        success: false,
        message: "이미 발급된 쿠폰입니다.",
      });
    }

    // 2) 없으면 INSERT
    await conn.query(
      `INSERT INTO user_coupon (user_id, discount_id, status)
            VALUES (?, ?, ?)`,
      [user_id, discount_id, status || "active"]
    );

    res.json({ success: true, message: "쿠폰이 정상 발급되었습니다." });
  } catch (err) {
    console.error("쿠폰 발급 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  } finally {
    if (conn) conn.release();
  }
});

// 주문내역 db저장
router.post("/history", async (req, res) => {
  try {
    const { userId } = req.body;
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `
        SELECT
        \`order\`.order_id,
        \`order\`.order_date,
        \`order\`.total_price,
        \`order\`.status,
        order_detail.quantity,
        order_detail.price,
        order_detail.delivery,
        order_detail.estimated_date,
        product.product_id,
        product.product_name
        FROM \`order\`
        JOIN order_detail ON \`order\`.order_id = order_detail.order_id
        JOIN product ON order_detail.product_id = product.product_id
        WHERE \`order\`.user_id = ?
        ORDER BY \`order\`.order_date DESC
    `,
      [userId]
    );
    res.json(rows);
    conn.release();
  } catch (err) {
    console.error("구매내역 조회 실패: ", err);
    res.status(500).json({ error: err.message || "서버오류" });
  } finally {
    conn && conn.release();
  }
});

// ✅ 개별 삭제
router.delete("/cart/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM cart WHERE cart_id = ?", [id]);
    conn.release();
    res.send(`id=${id} 삭제 완료`);
  } catch (err) {
    console.error("삭제 실패:", err);
    res.status(500).send("서버 오류");
  }
});
// ✅ 다중 삭제
router.post("/cart/delete-multiple", async (req, res) => {
  const toDelete = req.body.ids; // 예: [3, 7, 12]
  console.log("삭제할 ID들:", toDelete);

  const conn = await pool.getConnection();
  try {
    if (toDelete.length === 0) {
      return res.status(400).send("삭제할 ID가 없습니다.");
    }

    // ① 물음표(placeholder) 개수 생성: "?, ?, ?"
    const placeholders = toDelete.map(() => "?").join(",");

    // ② IN 절을 사용한 DELETE 쿼리
    const sql = `DELETE FROM cart WHERE cart_id IN (${placeholders})`;

    // ③ toDelete 배열을 파라미터로 전달
    await conn.query(sql, toDelete);

    res.send("선택된 항목들 삭제 완료");
  } catch (err) {
    console.error("삭제 오류:", err);
    res.status(500).send("서버 오류로 삭제에 실패했습니다.");
  } finally {
    conn.release();
  }
});

// Cart 삭제 by user_id+product_id: DELETE /cart
router.post("/cart/delete", async (req, res) => {
  const user_id = Number(req.query.user_id);
  const product_id = Number(req.query.product_id);
  if (!user_id || !product_id) {
    return res.status(400).json({ error: "user_id, product_id 필요" });
  }
  try {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM cart WHERE user_id=? AND product_id=?", [
      user_id,
      product_id,
    ]);
    conn.release();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Cart 추가
router.post("/cart", async (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ error: "user_id, product_id 필요" });
  }
  try {
    const conn = await pool.getConnection();
    // 이미 담긴 상품이면 수량만 업데이트
    const exists = await conn.query(
      "SELECT cart_id, quantity FROM cart WHERE user_id=? AND product_id=?",
      [user_id, product_id]
    );
    if (exists.length) {
      await conn.query("UPDATE cart SET quantity = ? WHERE cart_id = ?", [
        exists[0].quantity + (quantity || 1),
        exists[0].cart_id,
      ]);
    } else {
      await conn.query(
        "INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [user_id, product_id, quantity || 1, price || 0]
      );
    }
    conn.release();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 출석 도장 확인
router.get("/attendance/count", async (req, res) => {
  const user_id = req.query.user_id;
  const conn = await pool.getConnection();

  try {
    // 1. 해당 월 출석 날짜 가져오기
    const rows = await conn.query(
      `SELECT DATE_FORMAT(date,'%Y-%m-%d') AS day
            FROM user_attendance
            WHERE user_id = ?
            AND YEAR(date) = YEAR(NOW())
            AND MONTH(date) = MONTH(NOW())`,
      [user_id]
    );

    // 2. 쿠폰 발급 여부 확인 (선택: 쿠폰 ID가 정해져 있을 경우)
    const [couponRow] = await conn.query(
      `
            SELECT COUNT(*) AS used
            FROM user_coupon
            WHERE user_id = ? AND discount_id = 3 AND status = 'used'
            `,
      [user_id]
    );

    const days = rows.map((r) => r.day);
    const couponClaimed = couponRow.used > 0;

    res.json({ days, couponClaimed });
  } catch (err) {
    console.error("출석 기록 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  } finally {
    conn.release();
  }
});

// 출석 저장
router.post("/attendance", async (req, res) => {
  const { user_id, date } = req.body;
  if (!user_id || !date) return res.status(400).send("user_id, date 필요");

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT IGNORE INTO user_attendance (user_id, date)
            VALUES (?, ?)`,
      [user_id, date]
    );
    conn.release();
    res.json({ success: true });
  } catch (err) {
    console.error("출석 저장 실패:", err);
    res.status(500).send("서버 오류");
  }
});

// ✅ 선택 항목만 계산 요청
router.post("/cart/summary", async (req, res) => {
  const checkedItems = req.body; // [{ id, quantity, price }]
  try {
    const totalPrice = checkedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = checkedItems.length > 0 ? 1000 : 0;
    const delivery = checkedItems.length > 0 ? 3000 : 0;
    const finalPrice = totalPrice - discount + delivery;

    res.json({ totalPrice, discount, delivery, finalPrice });
  } catch (err) {
    console.error("요약 계산 실패:", err);
    res.status(500).send("서버 오류");
  }
});

// ✅ 주문 처리
router.post("/order", async (req, res) => {
  const {
    address,
    detailAddress,
    payment,
    discount_id,
    total_price,
    items,
    user_id,
  } = req.body;

  if (!address || !payment || !items || !items.length) {
    return res.status(400).send("필수 정보 누락");
  }

  const fullAddress = `${address} ${detailAddress ?? ""}`;

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // order 테이블 삽입
    const { insertId: order_id } = await conn.query(
      `
            INSERT INTO \`order\`
            (order_date, total_price, status, 
            payment_method, user_id, address, discount_id)
            VALUES (NOW(), ?, '결제완료', ?, ?, ?, ?)
            `,
      [total_price, payment, user_id, fullAddress, discount_id || null]
    );

    // order_detail 테이블에 삽입
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2);

    for (const item of items) {
      const subtotal = item.price * item.quantity;

      await conn.query(
        `INSERT INTO order_detail
                (quantity, price, delivery, subtotal, 
                product_id, order_id, estimated_date)
                VALUES (?, ?, '배송준비', ?, ?, ?, ?)`,
        [
          item.quantity,
          item.price,
          subtotal,
          item.product_id,
          order_id,
          estimatedDate,
        ]
      );
    }

    // 쿠폰 사용 처리
    if (discount_id) {
      const { affectedRows } = await conn.query(
        `UPDATE user_coupon
                SET status = 'used'
                WHERE user_id = ? AND discount_id = ? 
                AND status = 'active'`,
        [user_id, discount_id]
      );

      if (affectedRows === 0) {
        throw new Error("쿠폰이 없거나 이미 사용되었습니다.");
      }
    }

    // 장바구니 비우기
    const ids = items.map((i) => i.product_id);
    if (ids.length) {
      await conn.query(
        `DELETE FROM cart
                WHERE user_id = ? AND product_id
                IN (${ids.map(() => "?").join(",")})`,
        [user_id, ...ids]
      );
    }

    // 커밋
    await conn.commit();
    res.json({ success: true });

    // 에러 시 롤백
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("주문저장실패:", err);
    res.status(500).send("서버오류: " + err.message);
  } finally {
    conn && conn.release();
  }
});

module.exports = router;
