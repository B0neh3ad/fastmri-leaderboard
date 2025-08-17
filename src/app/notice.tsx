export default function Notice() {
  return (
    <div className="notice-content">
      <div className="notice-title">Leaderboard Freeze 안내</div>
      <div className="notice-text">
        <strong>Leaderboard가 freeze되었습니다.</strong> 현 시점에서 제출된 결과는 Leaderboard에 반영되지 않으나, <strong>유효한 제출</strong>입니다.
      </div>
      <div className="notice-text">
        대회 기간 중 <strong>마지막 제출</strong>이 leaderboard set에 대한 SSIM 점수로서 평가에 반영됩니다.
      </div>
    </div>
  );
}