// src/hooks/usePostcode.js
import { useEffect, useRef, useState } from 'react';

export function usePostcode() {
  const wrapRef = useRef(null);
  const [wrapVisible, setWrapVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePostcode = () => {
    setWrapVisible(true);

    setTimeout(() => {
      const element_wrap = wrapRef.current;
      new window.daum.Postcode({
        oncomplete: function (data) {
          const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          document.getElementById('sample3_postcode').value = data.zonecode;
          document.getElementById('sample3_address').value = addr;
          document.getElementById('sample3_detailAddress').focus();
          setWrapVisible(false);
        },
        autoClose: false,
        onresize: function (size) {
          element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%',
      }).embed(element_wrap);
    }, 0);
  };

  const handleClose = () => {
    setWrapVisible(false);
  };

  return {
    wrapRef,
    wrapVisible,
    handlePostcode,
    handleClose
  };
}
