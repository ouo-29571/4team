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

//회원가입

//이메일 중복확인
async function find_email(Signup_email) {
    const conn = await pool.getConnection();
    //배열형식으로만 받을 수 있음
    const [rows] = await conn.query(
        //수를 반환하되 coout라는 행으로 따로 저장
        "SELECT COUNT(*) AS count FROM user WHERE email = ?",
        [Signup_email]
    );
    //conn종료(?)
    conn.release();
    return [rows];
}
router.post("/check_email", async (req, res) => {
    const { Signup_email } = req.body;
    const rows = await find_email(Signup_email);
    if (rows[0].count > 0) {
        //row[0]:데이터 / row[1]: 데이터 정보
        email_exit = true;
    } else {
        email_exit = false;
    }

    //프론트한테 값 전달
    res.json({ email_exit });
});

//회원가입 정보 저장
async function signup_data(
    Signup_email,
    Signup_password,
    Signup_name,
    Signup_tel
) {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        "INSERT INTO user(email, password, name, tel) VALUES(?, ?, ?, ?)",
        [Signup_email, Signup_password, Signup_name, Signup_tel]
    );
    conn.release();
    return rows;
}
router.post("/signup", async (req, res) => {
    const { Signup_email, Signup_password, Signup_name, Signup_tel } = req.body;
    const rows = await signup_data(
        Signup_email,
        Signup_password,
        Signup_name,
        Signup_tel
    );

    signup_check = false;
    if (rows) {
        signup_check = true;
    }

    res.json({ signup_check });
});

//로그인

async function login_data(login_email, login_password) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        "SELECT COUNT(*) AS count FROM user WHERE email= ? AND PASSWORD= ?",
        [login_email, login_password]
    );

    conn.release();
    return [rows];
}
//user_id가져오기
async function login_data_userid(login_email, login_password) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        "SELECT user_id FROM user WHERE email = ? AND password = ?",
        [login_email, login_password]
    );
    conn.release();
    return rows;
}
router.post("/login_submit", async (req, res) => {
    const { login_email, login_password } = req.body;
    const rows = await login_data(login_email, login_password);

    login_check = false;
    login_userid = "";
    if (rows[0].count > 0) {
        login_check = true;
        const user_id = await login_data_userid(login_email, login_password);
        login_userid = user_id.user_id;
    }
    res.json({ login_check, login_userid });
});

//비밀번호 찾기
async function Passwordfind_data(Passwordfind_email) {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        "SELECT COUNT(*) AS count FROM user WHERE email= ?",
        [Passwordfind_email]
    );

    conn.release();
    return rows;
}
router.post("/Passwordfind", async (req, res) => {
    const { Passwordfind_email } = req.body;
    const rows = await Passwordfind_data(Passwordfind_email);

    if (rows[0].count > 0) {
        Passwordfind_result = true;
    } else {
        Passwordfind_result = false;
    }
    res.json({ Passwordfind_result });
});

//비밀번호 수정
async function Update_passwordfix(Passwordfix, user_email) {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        "UPDATE user SET password = ? WHERE email = ?",
        [Passwordfix, user_email]
    );
    conn.release();
    return rows;
}
router.post("/Passwordfix", async (req, res) => {
    const { Passwordfix, user_email } = req.body;
    const rows = await Update_passwordfix(Passwordfix, user_email);

    if (rows.affectedRows > 0) {
        Passwordfix_result = true;
    } else {
        Passwordfix_result = false;
    }
    res.json({ Passwordfix_result });
});

//마이페이지

//이름찾기
async function find_userName(User_email) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT name FROM user WHERE email= ?", [
        User_email,
    ]);
    conn.release();
    return [rows];
}
router.post("/Mypage_userName", async (req, res) => {
    const { User_email } = req.body;
    const rows = await find_userName(User_email);
    User_Name = rows[0].name;
    res.json({ User_Name });
});

//쿠폰 수 가져오기
async function find_couponcount(user_email) {
    const conn = await pool.getConnection();
    const row = conn.query("SELECT COUNT(*) AS count FROM discount");
    conn.release();
    return row;
}
router.post("/Mypage_couponcount", async (req, res) => {
    const { user_email } = req.body;
    const rows = await find_couponcount(user_email);
    count = rows[0].count;
    // BigInt 처리 (toString 또는 Number로 변환)
    if (typeof count === "bigint") {
        count = Number(count); // 또는 count.toString()
    }
    res.json({ count });
});

//쿠폰 데이터 가져오기
router.post("/Mypage_coupondata", async (req, res) => {
    const { user_email } = req.body;
    const conn = await pool.getConnection();
    const rows = await conn.query(
        "SELECT discount_id, name, discount, discount_type FROM discount"
    );
    conn.release();
    res.json(rows);
});

//주문및 배송상태 가져오기
router.post("/Mypage_userorder", async (req, res) => {
    const { user_id } = req.body;
    const conn = await pool.getConnection();
    const payment_rows = await pool.query(
        "SELECT COUNT(*) AS count FROM `order` WHERE status= ? AND user_id = ?",
        ["결제완료", user_id]
    );

    //배송준비 또는 배송중인 항목 검색
    const delivery_ing_rows = await pool.query(
        "SELECT COUNT(DISTINCT order_id) AS count FROM order_detail WHERE order_id IN (SELECT order_id FROM `order` WHERE status = ? AND user_id = ?) AND delivery = ? OR delivery = ?",
        ["결제완료", user_id, "배송준비", "배송중"]
    );

    //배송완료인 항목 검색
    const delivery_rows = await pool.query(
        "SELECT COUNT(DISTINCT order_id) AS count FROM order_detail WHERE order_id IN (SELECT order_id FROM `order` WHERE status = ? AND user_id = ?) AND delivery = ?",
        ["결제완료", user_id, "배송완료"]
    );

    conn.release();

    //형변환
    paymentcount = payment_rows[0].count;
    // BigInt 처리 (toString 또는 Number로 변환)
    if (typeof paymentcount === "bigint") {
        paymentcount = Number(paymentcount);
    }

    delivery_ingcount = delivery_ing_rows[0].count;
    if (typeof delivery_ingcount === "bigint") {
        delivery_ingcount = Number(delivery_ingcount);
    }

    deliverycount = delivery_rows[0].count;
    if (typeof deliverycount === "bigint") {
        deliverycount = Number(deliverycount);
    }

    //결제완료항목에서 배송준비 또는 배송중인 항목 제거
    paymentcount -= delivery_ingcount + deliverycount;

    //배송중인 항목에서 배송완료인 항목 제거
    delivery_ingcount -= deliverycount;

    res.json({ paymentcount, delivery_ingcount, deliverycount });
});

//회원정보 가져오기
async function find_userinfo(get_email) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        "SELECT email, name, tel FROM user WHERE email= ?",
        [get_email]
    );
    conn.release();
    return [rows];
}
router.post("/get_userinfo", async (req, res) => {
    const { get_email } = req.body;
    const rows = await find_userinfo(get_email);
    res.json({
        user_email: rows[0].email,
        user_name: rows[0].name,
        user_tel: rows[0].tel,
    });
});

//회원정보 이메일 중복확인
async function user_find_email(Userinfofix_email) {
    const conn = await pool.getConnection();
    //배열형식으로만 받을 수 있음
    const rows = await conn.query(
        //수를 반환하되 coout라는 행으로 따로 저장
        "SELECT COUNT(*) AS count FROM user WHERE email = ?",
        [Userinfofix_email]
    );
    //conn종료(?)
    conn.release();
    return rows;
}
router.post("/userinfo_check_email", async (req, res) => {
    const { Userinfofix_email } = req.body;
    const rows = await user_find_email(Userinfofix_email);

    user_email_exit = false;
    if (rows[0].count > 0) {
        user_email_exit = true;
    }

    //프론트한테 값 전달
    res.json({ user_email_exit });
});

//회원정보 수정
async function Update_signup_data(
    Userinfofix_email,
    Userinfofix_password,
    Userinfofix_name,
    Userinfofix_tel,
    user_name
) {
    const conn = await pool.getConnection();
    let rows;
    if (Userinfofix_password !== "") {
        const result = await conn.query(
            "UPDATE user SET email = ?, password = ?, name = ?, tel = ? WHERE email = ?",
            [
                Userinfofix_email,
                Userinfofix_password,
                Userinfofix_name,
                Userinfofix_tel,
                user_name,
            ]
        );
        rows = result;
    } else {
        const result = await conn.query(
            "UPDATE user SET email = ?, name = ?, tel = ? WHERE email = ?",
            [Userinfofix_email, Userinfofix_name, Userinfofix_tel, user_name]
        );
        rows = result;
    }

    conn.release();
    return rows;
}
router.post("/update_signup", async (req, res) => {
    const {
        Userinfofix_email,
        Userinfofix_password,
        Userinfofix_name,
        Userinfofix_tel,
        user_name,
    } = req.body;

    const rows = await Update_signup_data(
        Userinfofix_email,
        Userinfofix_password,
        Userinfofix_name,
        Userinfofix_tel,
        user_name
    );

    updata_signup_check = false;
    if (rows) {
        updata_signup_check = true;
    }

    res.json({ updata_signup_check });
});

module.exports = router;
