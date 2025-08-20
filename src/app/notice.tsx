export default function Notice({
  setNoticeVisible
}: {
  setNoticeVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="notice-container">
      <div className="notice-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#22c55e"/>
          <path d="M12 16v-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="notice-content">
        <div className="notice-title">Leaderboard 공개 (for Public Score)</div>
        <div className="notice-text">
          Leaderboard freeze가 해제되었습니다. 아래 순위는 마감 시점까지의 제출을 바탕으로 한 순위입니다.
        </div>
        <div className="notice-text">
          재현성 검증 및 Private Score Evaluation을 거치며, 최종 순위는 이와 달라질 수 있습니다.
        </div>
      </div>
      <button 
        className="notice-close-btn"
        onClick={() => setNoticeVisible(false)}
        aria-label="공지사항 닫기"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}