export default function Notice({
  setNoticeVisible
}: {
  setNoticeVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="notice-container">
      <div className="notice-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#0969da"/>
          <path d="M12 16v-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="notice-content">
        <div className="notice-title">Leaderboard Freeze 안내</div>
        <div className="notice-text">
          <strong>Leaderboard가 freeze되었습니다.</strong> 현 시점에서 제출된 결과는 Leaderboard에 반영되지 않으나, <strong>유효한 제출</strong>입니다.
        </div>
        <div className="notice-text">
          대회 기간 중 <strong>마지막 제출</strong>이 leaderboard set에 대한 SSIM 점수로서 평가에 반영됩니다.
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