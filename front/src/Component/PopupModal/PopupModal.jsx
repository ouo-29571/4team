import { useEffect, useState } from 'react';
import './PopupModal.css';

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 페이지 진입 시 모달 자동 열림
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-modal">       {/* 팝업 큰 틀 */}
        <button className="popup-close-button" onClick={handleClose}>X</button>
        <div className="popup-content">   {/* 팝업 내용 */}
          <h2>출석체크하고 <br/> 포인트 받기</h2>

          <div className="checkbox">      {/* 팝업틀 - 출석 틀 */}
            <p>출석 check~! <img className="checkimg" src="/img/체크.png"/></p>
            
            <div className="checking">                                {/* 출석틀 - 출석도장 */}
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/> 
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
              <img className="checkingimg" src="/img/출석도장.png"/>
            </div>
          </div>

          <button className="ck-button">출석 체크 하러 가기</button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
