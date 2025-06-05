import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'
import {useCart} from './useCart';

function Cart() {
    const navigate = useNavigate();
    const { 
      cartItems, 
      summary, 
      allCheck, 
      toggleCheck, 
      selected_Delete, 
      del_btn, 
      placeOrder 
    } = useCart();

    const isAllChecked = 
      cartItems.length > 0 && cartItems.every(item => item.checked);

  return (
   <>
   <div>
    <h2>장바구니</h2>
   </div>
   <main>
    <section>
      {/* 상단 전체선택, 선택삭제 */}
      <div className="choiceBox">
        <form>
          <input 
            type="checkbox"
            checked={isAllChecked}
            onChange={(e) => allCheck(e.target.checked)}
          />
          <p>전체선택</p>
          <button
            type="button"
            onClick={selected_Delete}
            style={{marginLeft:'auto'}}
            >
            선택삭제
          </button>
        </form>
      </div>

      {/* 장바구니 목록 */}
      {cartItems.map((item, index) =>(
      <div key={item.id ?? index} className="cartList">
        <div className="leftBox">
          <form>
            <input 
              type="checkbox"
              checked={item.checked}
              onChange={()=> toggleCheck(index)}
            />
          </form>
          <div className="imgBox">
            <img src='#'></img>
          </div>
        </div>
        <div className="centerBox">
          <br />
          <input value={item.name} className="full-input" placeholder='상품명' readOnly></input>
          <input value={item.quantity || ''} className="full-input" placeholder='수량' readOnly></input>
          <input value={item.price || ''} className="full-input" placeholder='금액' readOnly></input>
        </div>
        <div className="rightBox">
          <button onClick={()=> del_btn(item.id)}>삭제</button>
        </div>
      </div>
      ))}

      {/* 구매 영역 */}
      <div className="purchaseBox">
        <h4>주문 예상 금액</h4>
        <form>
          <p>총 상품가격</p>
          <input value={summary.totalPrice} type="text" className='small-input' readOnly></input>
          <p>+ 총 할인</p>
          <input value={summary.discount} type="text" className='small-input' readOnly></input>
          <p>+ 총 배송비</p>
          <input value={summary.delivery} type="text" className='small-input' readOnly></input>
        </form>
        <br></br>
        <input value={summary.finalPrice} placeholder='총 금액' className="full-input" readOnly></input>
        <br></br>
        <button 
          onClick={()=> placeOrder(navigate)} 
          style={{width:'800px'}}
        >
          구매하기
        </button>
      </div>
    </section>
   </main>
   <footer></footer>
   </>
  )
}

export default Cart;
