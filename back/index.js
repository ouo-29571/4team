const mariadb = require("mariadb");
const express = require("express");
const cors = require("cors");

const app = express();

const pool = mariadb.createPool({
    host: "192.168.0.191",
    user: "4team",
    password: "4team",
    database: "4team",
    port: "3306",
});
// 원래 코드
// const pool = mariadb.createPool({
//     host: "127.0.0.1", //192.168.0.191
//     user: "root", //4team
//     password: "root", //4team
//     database: "test_del", //4team
//     port: "3306",
// });

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
    console.log("서버 실행중");
});

// 준범 주석남기기

//삭제용

//테스트중 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get("/api/test", async (req, res) => {
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

//테스트중 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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
app.post("/check_email", async (req, res) => {
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
app.post("/signup", async (req, res) => {
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

app.post("/login_submit", async (req, res) => {
    const { login_email, login_password } = req.body;
    const rows = await login_data(login_email, login_password);

    login_check = false;
    if (rows[0].count > 0) {
        login_check = true;
    }

    res.json({ login_check });
});

//비밀번호 찾기 수정
async function Passwordfind_data(Passwordfind_email) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        "SELECT COUNT(*) AS count FROM user WHERE email= ?",
        [Passwordfind_email]
    );

    conn.release();
    return [rows];
}
app.post("/Passwordfind", async (req, res) => {
    const { Passwordfind_email } = req.body;
    const rows = await Passwordfind_data(Passwordfind_email);

    if (rows[0].count > 0) {
        Passwordfind_result = true;
    } else {
        Passwordfind_result = false;
    }
    res.json({ Passwordfind_result });
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
app.post("/Mypage_userName", async (req, res) => {
    const { User_email } = req.body;
    const rows = await find_userName(User_email);
    User_Name = rows[0].name;
    res.json({ User_Name });
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

app.post("/get_userinfo", async (req, res) => {
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
app.post("/userinfo_check_email", async (req, res) => {
    const { Userinfofix_email } = req.body;
    const rows = await user_find_email(Userinfofix_email);

    console.log(rows[0].count);
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
    console.log(user_name);
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

app.post("/update_signup", async (req, res) => {
    console.log(req.body);

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

    console.log(user_name);
    updata_signup_check = false;
    if (rows) {
        updata_signup_check = true;
    }

    res.json({ updata_signup_check });
});
