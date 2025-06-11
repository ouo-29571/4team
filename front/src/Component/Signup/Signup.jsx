import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState("");
  //에러문구
  const [Signup_error, setSignup_error] = useState({
    Signup_error_email: "",
    Signup_error_password: "",
  });

  //DB에 저장하기 위해
  const [Signup_form, setSignup_form] = useState({
    Signup_email: "",
    Signup_password: "",
    Signup_name: "",
    Signup_tel: "",
  });

  //input태그 휠로 값 변경방지
  const handlewheel_input = (e) => {
    e.target.blur();
  };

  //이메일 중복확인
  const handleBlurOrEnter_email = async (e) => {
    const email_value = e.target.value;
    //form 이메일 값 전달
    setSignup_form((prev) => ({ ...prev, Signup_email: email_value }));

    //DB 값 전달
    const response = await fetch("http://localhost:8080/check_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //데이터 타입 : 데이터형식(json)
      },
      //객체형식 데이터 전달
      body: JSON.stringify({ Signup_email: email_value }),
    });

    //받은 값 활용
    //서버에서 받은 json데이터를 자바스크립트 객체로 변환하여 저장
    const data = await response.json();
    if (data.email_exit === true) {
      setSignup_error((prev) => ({
        ...prev,
        Signup_error_email: "이미 존재하는 이메일입니다.",
      }));
    } else {
      setSignup_error((prev) => ({ ...prev, Signup_error_email: "" }));
    }
  };

  //재확인 비밀번호 값 저장
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // 비밀번호, 비밀번호학인의 필드값 일치하는지 판단
  const handleBlurOrEnter = () => {
    if (Signup_form.Signup_password != confirmPassword) {
      //prev: 이전 상태값 복사 후 키(password)를 덮어쓰기하여 업데이트
      setSignup_error((prev) => ({
        ...prev,
        Signup_error_password: "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      //에러문구 삭제
      setSignup_error((prev) => ({ ...prev, Signup_error_password: "" }));
    }
  };

  //DB에 전달할 form에 값 저장
  function handleChange(e) {
    const { id, value } = e.target;
    setSignup_form((prev) => ({ ...prev, [id]: value }));
  }

  //DB저장
  const handleSignup_Submit = async (e) => {
    e.preventDefault();
    //에러에 문구가 있으닌 true
    if (Signup_error.Signup_error_password) {
      alert("비밀번호가 일치하지 않습니다.");
    } else if (Signup_error.Signup_error_email) {
      alert("중복된 이메일입니다.");
    } else {
      //DB에 화원가입정보 보내기
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Signup_form),
      });

      const data = await response.json();
      if (data.signup_check) {
        navigate("/Login");
      }
    }
  };

  return (
    <>
      <div className="signup_page">
        <div>{/* 상단 헤더 추가 예정 */}</div>
        {/* 회원가입 */}
        <div className="signupcontainer">
          <div className="signup_logo">
            <img src="/img/logo2.png" />
            <div className="signup_logo_text">vintage haus</div>
          </div>
          <div>
            <form className="signupform" onSubmit={handleSignup_Submit}>
              <div className="input-container">
                <div>
                  {/* htmlFor: 글씨를 클릭했을때 input으로 이동하므로 id와 세트로 생각하면될듯?? */}
                  <label htmlFor="Signup_email">이메일</label>
                </div>
                <div>
                  <input
                    type="email"
                    id="Signup_email"
                    placeholder="이메일을 입력하세요"
                    value={Signup_form.Signup_email}
                    onChange={handleChange}
                    onBlur={handleBlurOrEnter_email} //input바깥영역을 눌렀을 경우 발생하는 이벤트 (반대; onFocus)
                    onKeyDown={(e) => {
                      //키보드 눌렀을 경우 발생
                      if (e.key === "Enter") handleBlurOrEnter_email();
                    }}
                    required /*필수 입력란*/
                  />
                </div>
              </div>
              {Signup_error.Signup_error_email && (
                <p style={{ color: "red" }}>
                  {Signup_error.Signup_error_email}
                </p>
              )}
              <div className="input-container">
                <div>
                  <label htmlFor="Signup_password">비밀번호</label>
                </div>
                <div>
                  <input
                    type="password"
                    id="Signup_password"
                    value={Signup_form.Signup_password}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlurOrEnter} //input바깥영역을 눌렀을 경우발생하는 이벤트 (반대; onFocus)
                    onKeyDown={(e) => {
                      //키보드 눌렀을 경우 발생
                      if (e.key === "Enter") {
                        handleBlurOrEnter();
                      }
                    }}
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                </div>
              </div>
              <div className="input-container">
                <div>
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                </div>
                <div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    placeholder="비밀번호를 입력하세요"
                    required
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleBlurOrEnter} //input바깥영역을 눌렀을 경우발생하는 이벤트 (반대; onFocus)
                    onKeyDown={(e) => {
                      //키보드 눌렀을 경우 발생
                      if (e.key === "Enter") handleBlurOrEnter();
                    }}
                  />
                </div>
              </div>
              {Signup_error.Signup_error_password && (
                <p style={{ color: "red" }}>
                  {Signup_error.Signup_error_password}
                </p>
              )}
              <div className="input-container">
                <div>
                  <label htmlFor="Signup_name">이름</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="Signup_name"
                    value={Signup_form.Signup_name}
                    placeholder="이름을 입력하세요"
                    required
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div>
              </div>
              <div className="input-container">
                <div>
                  <label htmlFor="Signup_tel">전화번호</label>
                </div>
                <div>
                  <input
                    className="Signup_tel_input"
                    type="number"
                    id="Signup_tel"
                    value={Signup_form.Signup_tel}
                    placeholder="전화번호를 입력하세요 (-제외)"
                    required
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    //마우스 휠 이벤트
                    onWheel={handlewheel_input}
                  />
                </div>
              </div>
              <button type="submit" className="signup_button">
                회원가입
              </button>
            </form>
          </div>
        </div>
        <div>{/* footer추가예정 */}</div>
      </div>
    </>
  );
};

export default Signup;
