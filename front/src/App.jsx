//222

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

//import Main from "";
import Login from "./Component/Login/Login";
import Signup from "./Component/Signup/Signup";
import Passwordfind from "./Component/Passwordfind/Passwordfind";
import Passwordfix from "./Component/Passwordfix/Passwordfix";
import Mypage from "./Component/Mypage/Mypage";
import Userinfofix from "./Component/Userinfofix/Userinfofix";
import Main from "./Component/Main/Main";
import Menu from "./Component/Menu/Menu";
import DetailPage from "./Component/Menu/DetailPage/DetailPage";
import Header from "./Component/Main/Header/Header";
import Footer from "./Component/Menu/Footer/Footer";
import EventPage from "./Component/EventPage/EventPage";
import ImageSlider from "./Component/Main/ImageSlider/ImageSlider";
import Cart from "./Component/cart/Cart";
import Order from "./Component/order/Order";
import History from "./Component/history/History";
import CustomerCenter from "./Component/Menu/Footer/CustomerCenter/CustomerCenter";
import TermsOfService from "./Component/Menu/Footer/TermsOfService/TermsOfService";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/" element={<Main />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/DetailPage/:id" element={<DetailPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Passwordfind" element={<Passwordfind />} />
          <Route path="/Passwordfix" element={<Passwordfix />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Userinfofix" element={<Userinfofix />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/EventPage" element={<EventPage />} />
          <Route path="/ImageSlider" element={<ImageSlider />} />
          <Route path="/Order" element={<Order />} />
          <Route path="/History" element={<History />} />
          <Route path="/CustomerCenter" element={<CustomerCenter />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
