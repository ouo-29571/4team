// 와 개어려워

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

//첫글자 대문자(무조건)
//import Main from "";
import Login from "./Component/Login/Login";
import Signup from "./Component/Signup/Signup";
import Password_find from "./Component/Password_find";
import Mypage from "./Component/Mypage/Mypage";
import Userinfofix from "./Component/Userinfofix/Userinfofix";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 나도 성공? */}

          {/* 수정할 예정 */}
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Password_find" element={<Password_find />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Userinfofix" element={<Userinfofix />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
