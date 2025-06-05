import { useEffect, useState } from 'react';

export function useCart() {
  // 장바구니 항목 상태
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    totalPrice: 0, 
    discount: 0, 
    delivery: 0,
    finalPrice: 0
  });
  
  useEffect(() => {
    fetch('http://localhost:8080/cart')
      .then(res => res.json())
      .then(data => {
        const withChecked = data.cart.map(item => ({
          ...item,
          checked: false,
          product_id: item.product_id
        }));
        setCartItems(withChecked);
      })
      .catch(err => console.error('장바구니 가져오기 실패:', err));
  }, []);

  useEffect (() => {
    const checkedItems = cartItems.filter(item => item.checked);
    const totalPrice = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = checkedItems.length > 0 ? 3000 : 0;
    const delivery = checkedItems.length > 0 ? 3000 : 0;
    const finalPrice = totalPrice - discount + delivery;

    setSummary({totalPrice, discount, delivery, finalPrice});
  }, [cartItems]);

  // 전체 선택
  const allCheck = (checked) => {
    setCartItems(prev => prev.map(item => ({ ...item, checked })));
  };

  // 체크박스 토글 (개별 선택)
  const toggleCheck = (index) => {
    setCartItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 선택 삭제
  const selected_Delete = () => {
    const toDelete = cartItems.filter(item => item.checked).map(item => item.id)
      fetch(`http://localhost:8080/cart/delete-multiple`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ ids: toDelete })
      })
        .then(() => {
          return fetch('http://localhost:8080/cart');
        })
        .then(res => res.json())
        .then(data => {
          const withChecked = data.cart.map(item => ({ ...item, checked: false }));
          setCartItems(withChecked);
          setSummary(data.summary);
    })
    .catch(err => console.error('선택 삭제 실패:', err));
  };

  // 개별 삭제 버튼 (id 기준 삭제)
  const del_btn = (id) => {
    fetch(`http://localhost:8080/cart/${id}`,{
      method: 'DELETE'
    })
    .then(() => {
      setCartItems(prev => prev.filter(item => item.id !== id));
    })
    .catch(err => console.error('개별 삭제 실패:', err));
  };

  const placeOrder = (navigate) => {
    const orderItems = cartItems.filter(item => item.checked);
    if (orderItems.length === 0) return alert("주문할 항목을 선택하세요!");

    navigate('/order', {state: {items: orderItems } });
  };


  return {
    cartItems,
    setCartItems,
    summary,
    allCheck,
    toggleCheck,
    selected_Delete,
    del_btn,
    placeOrder
  };
}

export default useCart;
