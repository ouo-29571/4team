import { useCallback, useState } from "react";
import "../EventPage/EventPage.css";
import Daycheck from "./Daycheck/Daycheck";

function EventPage() {
    const sessionUser = sessionStorage.getItem("user");
    const user = sessionUser ? JSON.parse(sessionUser) : null;
    const [claimed, setClaimed] = useState(false);

    // 쿠폰 발급할 id
    const discountIds = [1, 2];

    const handleCoupon = useCallback(async () => {
        //로그인 체크
        if (!user) {
            alert("로그인 후 이용해 주세요.");
            return;
        }
        // 여러쿠폰 한번에 발급
        try {
            const responses = await Promise.all(
                discountIds.map((id) =>
                    fetch("http://localhost:8080/coupon", {
                        // proxy 세팅 시
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_id: user.id,
                            discount_id: id,
                        }),
                    })
                )
            );
            // 409 체크
            if (responses.some((r) => r.status === 409)) {
                return alert("이미 발급된 쿠폰이 있습니다.");
            } else if (responses.some((r) => !r.ok)) {
                return alert("쿠폰 발급 중 오류가 발생했습니다.");
            } else {
                alert("쿠폰이 발급되었습니다!");
                setClaimed(true);
            }
        } catch (err) {
            console.error(err);
            alert("쿠폰 발급 도중 문제가 발생했습니다.");
            setClaimed(false);
        }
    }, [user, discountIds]);

    return (
        <div className="eventpage-bigbox">
            {/* ✅ 놓치기 아까운 첫 혜택 */}
            <section className="vintage-section">
                <div className="vt-wrapper">
                    <div className="vt-textbox">
                        <div className="vt-text">
                            <h2 className="vt-text-logo">vintage haus</h2>
                            <h2>놓치기 아까운 첫 혜택</h2>
                            <div className="vt-text-wrapper">
                                <p>
                                    <br />
                                    <br />
                                    <br />
                                    6/1 ~ 6/30
                                </p>
                                <h3 className="vt-p-start">
                                    <br />
                                    신규 회원 가입 혜택, <br />
                                    빈티지 하우스와 새롭게 시작해보세요.
                                </h3>
                                <p className="vt-p-event">
                                    event 1. 첫 구매 시 99% 할인 <br />
                                    event 2. 신규 가입 시 10,000원 즉시 할인
                                    <br />
                                    event 3. 출석체크 시 포인트 지급
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="vt-imgbox">
                        <img className="vt-img" src="/img/salebg.png"></img>
                    </div>
                </div>
            </section>

            {/* ✅할인 쿠폰 받기 */}
            <section className="coupon-section">
                <p className="cp-banner">할인 쿠폰에 포인트까지!</p>

                <div className="cp-title">
                    {" "}
                    {/* 신규회원 혜택 */}
                    <h6>신규 회원 혜택</h6>
                    <h3>쿠폰 받기</h3>
                </div>

                <div className="cp-items">
                    {" "}
                    {/* 쿠폰사진 */}{" "}
                    <div className="couponzip-box">
                        <img
                            className="couponzipimg"
                            src="/img/쿠폰집.png"
                        ></img>
                    </div>
                </div>
                <div className="cpbtn-wrapper">
                    <button
                        className="cp-button"
                        onClick={handleCoupon}
                        disabled={claimed}
                    >
                        {claimed ? "이미 발급된 쿠폰" : "쿠폰 한 번에 받기"}
                    </button>
                </div>
            </section>

            {/* ✅ 출석체크하고 할인 받기 */}
            <section className="attendance-section">
                <div className="at-title">
                    <h6>출석체크하고</h6>
                    <h3>포인트 받기</h3>
                </div>
                <div className="at-date-wrapper">
                    <div className="at-date">6/1 ~ 6/30</div>
                </div>

                <div className="at-boxline">
                    <div className="at-textbox">
                        <span className="at-text">매일매일 500p 적립</span>
                    </div>

                    <div className="at-daybox">
                        {Array.from({ length: 9 }, (_, i) => (
                            <Daycheck key={i} day={i + 1} />
                        ))}
                    </div>
                </div>

                <button
                    className="at-button"
                    onClick={() => alert("출석 체크 완료되었습니다!")}
                >
                    오늘 출석 체크 하기
                </button>
            </section>
        </div>
    );
}

export default EventPage;
