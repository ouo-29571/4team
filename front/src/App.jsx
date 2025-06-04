//222

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
import Main from "./Component/Main/Main";
import Menu from "./Component/Menu/Menu";
import DetailPage from "./Component/Menu/DetailPage/DetailPage";
import Header from "./Component/Main/Header/Header";
import Footer from "./Component/Menu/Footer/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* 나도 성공? */}

          {/* 수정할 예정 */}
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/" element={<Main />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/DetailPage" element={<DetailPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Password_find" element={<Password_find />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Userinfofix" element={<Userinfofix />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
