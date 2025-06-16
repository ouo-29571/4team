import { useCallback, useEffect, useState } from "react";
import "../EventPage/EventPage.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function EventPage() {
    // 로그인 정보 가져오기
    const sessionUser = sessionStorage.getItem("user");
    const user = sessionUser ? JSON.parse(sessionUser) : null;

    const [days, setDays] = useState([]);
    const [claimable, setClaimable] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const GOAL = 5;
    const ATTEND_COUPON_ID = 3;

    // 쿠폰 한번에 받기
    // 발급할 쿠폰id
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

    // 출석체크 쿠폰받기
    useEffect(() => {
        if (!user) return;
        fetch(`http://localhost:8080/attendance/count?user_id=${user.id}`)
            .then((r) => r.json())
            .then(({ days: d, couponClaimed }) => {
                setDays(d);
                setClaimable(d.length > -GOAL && !couponClaimed);
            });
    }, [user]);

    // 오늘 출석 버튼
    const checkToday = useCallback(async () => {
        if (!user) return alert("로그인 해주세요");

        const today = new Date().toISOString().slice(0, 10);
        if (days.includes(today)) return alert("오늘은 이미 출석했습니다.");

        try {
            const r = await fetch("http://localhost:8080/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, date: today }),
            });
            if (!r.ok) throw new Error();

            setDays((prev) => [...prev, today]);
            if (days.length + 1 >= GOAL) setClaimable(true);
            alert("출석 완료!");
        } catch {
            alert("출석 저장 실패");
        }
    }, [user, days]);

    // 쿠폰 발급 버튼
    const claimCoupon = async () => {
        if (!user) return;
        try {
            const r = await fetch("http://localhost:8080/coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    discount_id: ATTEND_COUPON_ID,
                }),
            });
            if (r.status === 409) return alert("이미 발급된 쿠폰입니다.");
            if (!r.ok) throw new Error();
            alert("쿠폰발급 완료!");
            setClaimable(false);
        } catch {
            alert("쿠폰 발급 오류");
        }
    };

    // 달력에 도장 찍기
    const toLocalDateString = (date = new Date()) => {
        const tz = date.getTimezoneOffset() * 60000;
        const local = new Date(date.getTime() - tz);
        return local.toISOString().slice(0, 10);
    };

    const tileClassName = ({ date, view }) => {
        if (view !== "month") return;

        const dateStr = toLocalDateString(date);
        const classes = [];

        // ✅ 출석 도장
        if (days.includes(dateStr))
            classes.push("react-calendar__tile--attended");

        // ✅ 토요일이면 파란색
        if (date.getDay() === 6) classes.push("calendar-saturday");

        return classes.join(" ");
    };

    const tileContent = ({ date, view }) =>
        view === "month" && days.includes(toLocalDateString(date)) ? (
            <span className="stamp-icon">✅</span>
        ) : null;

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
                <div className="cp-title">
                    <h3>출석체크 하고 쿠폰 받기</h3>
                </div>
                <Calendar
                    className="attend-calendar"
                    calendarType="gregory"
                    locale="ko"
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    value={new Date()}
                />
                <div className="attend-action">
                    <button className="at-button" onClick={checkToday}>
                        오늘 출석 체크 하기
                    </button>

                    {claimable && (
                        <button className="cp-button" onClick={claimCoupon}>
                            출석 쿠폰 받기
                        </button>
                    )}
                </div>

                <p className="stamp-counter">
                    도장 {days.length} / {GOAL}
                </p>
            </section>
        </div>
    );
}

export default EventPage;
