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

// ✅ 장바구니 전체 조회 + 요약 계산
router.get('/cart', async (req, res) => {
  const user_id = Number(req.query.user_id);
  if(!user_id) return res.status(400).json({error:'user_id 필요'});
  try {
    const conn = await pool.getConnection();

    const cartRows = await conn.query(`
      SELECT 
        cart.cart_id AS id, 
        cart.quantity, 
        cart.price, 
        product.product_name AS name,
        product.product_id
      FROM cart
      JOIN product ON cart.product_id = product.product_id
      WHERE cart.user_id = ?
    `, [user_id]);

    const totalPrice = cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cartRows.length > 0 ? 1000 : 0;
    const delivery = totalPrice === 0 ? 0 : totalPrice < 30000 ? 3000 : 0;
    const finalPrice = totalPrice - discount + delivery;

    res.json({
      cart: cartRows,
      summary: { totalPrice, discount, delivery, finalPrice }
    });

  } catch (err) {
    console.error('장바구니 조회 실패:', err);
    res.status(500).send('서버 오류');
  } finally {
    conn && conn.release();
  }
});


// 할인정보 가져오기
router.get('/discounts',async (req, res) => {
    try{
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT discount_id, name, discount, discount_type FROM discount");
        res.json(rows);
        conn.release();
    } catch(err) {
        console.error("할인 목록 불러오기 실패:", err);
        res.status(500).send("서버 오류");
    }
});

// 주문내역 db저장
router.get('/history', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT
        \`order\`.order_id,
        \`order\`.order_date,
        \`order\`.total_price,
        \`order\`.status,
        order_detail.quantity,
        order_detail.price,
        order_detail.delivery,
        order_detail.estimated_date,
        product.product_name
      FROM \`order\`
      JOIN order_detail ON \`order\`.order_id = order_detail.order_id
      JOIN product ON order_detail.product_id = product.product_id
      WHERE \`order\`.user_id = 1
      ORDER BY \`order\`.order_date DESC
    `);
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
router.delete('/cart/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM cart WHERE cart_id = ?', [id]);
    conn.release();
    res.send(`id=${id} 삭제 완료`);
  } catch (err) {
    console.error('삭제 실패:', err);
    res.status(500).send('서버 오류');
  }
});
// ✅ 다중 삭제
router.post('/cart/delete-multiple', async (req, res) => {
  const toDelete = req.body.ids; // 예: [3, 7, 12]
  console.log('삭제할 ID들:', toDelete);

  const conn = await pool.getConnection();
  try {
    if (toDelete.length === 0) {
      return res.status(400).send('삭제할 ID가 없습니다.');
    }

    // ① 물음표(placeholder) 개수 생성: "?, ?, ?"
    const placeholders = toDelete.map(() => '?').join(',');

    // ② IN 절을 사용한 DELETE 쿼리
    const sql = `DELETE FROM cart WHERE cart_id IN (${placeholders})`;

    // ③ toDelete 배열을 파라미터로 전달
    await conn.query(sql, toDelete);

    res.send('선택된 항목들 삭제 완료');
  } catch (err) {
    console.error('삭제 오류:', err);
    res.status(500).send('서버 오류로 삭제에 실패했습니다.');
  } finally {
    conn.release();
  }
});

// Cart 삭제 by user_id+product_id: DELETE /cart
router.delete('/cart', async (req, res) => {
  const user_id    = Number(req.query.user_id);
  const product_id = Number(req.query.product_id);
  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'user_id, product_id 필요' });
  }
  try {
    const conn = await pool.getConnection();
    await conn.query(
      'DELETE FROM cart WHERE user_id=? AND product_id=?',
      [user_id, product_id]
    );
    conn.release();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Cart 추가
router.post('/cart', async (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'user_id, product_id 필요' });
  }
  try {
    const conn = await pool.getConnection();
    // 이미 담긴 상품이면 수량만 업데이트
    const exists = await conn.query(
      'SELECT cart_id, quantity FROM cart WHERE user_id=? AND product_id=?',
      [user_id, product_id]
    );
    if (exists.length) {
      await conn.query(
        'UPDATE cart SET quantity = ? WHERE cart_id = ?',
        [ exists[0].quantity + (quantity||1), exists[0].cart_id ]
      );
    } else {
      await conn.query(
        'INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [user_id, product_id, quantity||1, price||0]
      );
    }
    conn.release();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


// ✅ 선택 항목만 계산 요청
router.post('/cart/summary', async (req, res) => {
  const checkedItems = req.body; // [{ id, quantity, price }]
  try {
    const totalPrice = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = checkedItems.length > 0 ? 1000 : 0;
    const delivery = checkedItems.length > 0 ? 3000 : 0;
    const finalPrice = totalPrice - discount + delivery;

    res.json({ totalPrice, discount, delivery, finalPrice });
  } catch (err) {
    console.error('요약 계산 실패:', err);
    res.status(500).send('서버 오류');
  }
});

// ✅ 주문 처리
router.post('/order', async (req, res) => {
  const { address, detailAddress, payment, discount_id, total_price, items } = req.body;

  if (!address || !payment || !items || items.length === 0) {
    return res.status(400).send("필수 정보 누락");
  }

  const fullAddress = `${address} ${detailAddress ?? ''}`;
  const user_id = 1; // 임시 사용자 (로그인 기능 없다면 고정값)

  try {
    const conn = await pool.getConnection();

    // order 테이블에 삽입
    const orderResult = await conn.query(
      `INSERT INTO \`order\` (order_date, total_price, status, payment_method, user_id, address, discount_id)
       VALUES (NOW(), ?, '결제완료', ?, ?, ?, ?)`,
      [total_price, payment, user_id, fullAddress, discount_id || null]
    );

    const order_id = orderResult.insertId;

    // order_detail 테이블에 삽입
    for (const item of items) {
      const subtotal = item.price * item.quantity;
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 2);

      await conn.query(
        `INSERT INTO order_detail
         (quantity, price, delivery, subtotal, product_id, order_id, estimated_date)
         VALUES (?, ?, '배송준비', ?, ?, ?, ?)`,
        [item.quantity, item.price, subtotal, item.product_id, order_id, estimated_date]
      );
    }
    const productIds = items.map(item => item.product_id);
    const placeholders = productIds.map(() => '?').join(',');
    await conn.query(
      `DELETE FROM cart WHERE product_id IN (${placeholders}) AND user_id = ?`,
      [...productIds, user_id]
    );

    conn.release();
    res.send('주문 저장 완료');
  } catch (err) {
    console.error('주문 저장 실패:', err);
    res.status(500).send('서버 오류');
  }
});





module.exports = router;