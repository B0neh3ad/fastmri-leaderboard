"use client"

import { useEffect, useState } from "react";
import './page.css';
import Notice from "./notice";

interface TeamInfo {
  rank: number;
  team: string;
  score: number;
  timestamp: string;
};

interface LastSubmission {
  idx: number;
  timestamp: string;
  team: string;
  score: string;
};

// Fri Jun 27 2025 22:07:20 GMT+0900 (Korean Standard Time) -> 2025-06-27 22:07:20
function parseDateString(dateStr: string): string {
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth()는 0부터 시작
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function isParsableFloat(value: string) {
  return typeof value === "number"
    ? Number.isFinite(value) // 이미 number 타입이면 finite 체크
    : isFinite(Number(value)); // 문자열 등 변환 시도
}

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<TeamInfo[]>([]);
  const [currentLeaderboard, setCurrentLeaderboard] = useState<TeamInfo[]>([]);
  const [lastSubmissions, setLastSubmissions] = useState<LastSubmission[]>([]);
  const [currentLastSubmissions, setCurrentLastSubmissions] = useState<LastSubmission[]>([]);

  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);
  const [lastSubmissionsLoading, setLastSubmissionsLoading] = useState<boolean>(true);

  const [leaderboardPage, setLeaderboardPage] = useState<number>(1);
  const [lastSubmissionsPage, setLastSubmissionsPage] = useState<number>(1);
  const [leaderboardTotalPages, setLeaderboardTotalPages] = useState<number>(1);
  const [lastSubmissionsTotalPages, setLastSubmissionsTotalPages] = useState<number>(1);
  const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isContestEnded, setIsContestEnded] = useState<boolean>(false);
  const [timerExpanded, setTimerExpanded] = useState<boolean>(true);

  // const API_URL = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_SHEET_ID}/exec`;
  const API_URL = 'https://script.google.com/macros/s/AKfycbx8Cs8iBDvzPyD31sx4WRNEa1PFo7nxt68D3AOSRiALiLLr8AeTUsXGGsDlihKnR0Lk/exec';

  const fetchLeaderboard = () => {
    setLeaderboardLoading(true);
    fetch(`${API_URL}?path=leaderboard`)
      .then((response) => response.json())
      .then((result) => {
        // console.log('Leaderboard data:', result);
        setLeaderboard(result.data || result);
        setLeaderboardLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardLoading(false);
      });
  };

  const fetchLastSubmissions = () => {
    setLastSubmissionsLoading(true);
    fetch(`${API_URL}?path=last-submission`)
      .then((response) => response.json())
      .then((result) => {
        // console.log('Last submissions data:', result);
        setLastSubmissions(result.data || result);
        setLastSubmissionsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching last submissions:', error);
        setLastSubmissionsLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchLastSubmissions();
  }, []);

  useEffect(() => {
    setLeaderboardTotalPages(Math.ceil(leaderboard.length / 10));
  }, [leaderboard]);

  useEffect(() => {
    setLastSubmissionsTotalPages(Math.ceil(lastSubmissions.length / 10));
  }, [lastSubmissions]);

  useEffect(() => {
    setCurrentLeaderboard(leaderboard.slice((leaderboardPage - 1) * 10, leaderboardPage * 10));
  }, [leaderboard, leaderboardPage]);

  useEffect(() => {
    setCurrentLastSubmissions(lastSubmissions.slice((lastSubmissionsPage - 1) * 10, lastSubmissionsPage * 10));
  }, [lastSubmissions, lastSubmissionsPage]);

  useEffect(() => {
    const endDate = new Date('2025-08-21T00:00:00+09:00');
    let interval: NodeJS.Timeout;
    
    const updateTimer = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('대회가 종료되었습니다');
        setIsContestEnded(true);
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
    };
    
    updateTimer();
    interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <header>
        <h1>2025 SNU FastMRI Challenge Leaderboard</h1>
      </header>

      <div id="counter" className={isContestEnded ? 'contest-ended' : ''}>
        <div className="timer-header" onClick={() => setTimerExpanded(!timerExpanded)}>
          {!isContestEnded && (
            <div className="timer-label">대회 종료까지</div>
          )}
          <button className="accordion-toggle" aria-expanded={timerExpanded}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              style={{ transform: timerExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M4 6l4 4 4-4H4z"/>
            </svg>
          </button>
        </div>
        <div className={`timer-content ${timerExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="timer-container">
            {isContestEnded ? (
              <div style={{ color: '#c62828', fontSize: '24px', fontWeight: 'bold' }}>
                {timeRemaining}
              </div>
            ) : (
              <>
                {(() => {
                  const match = timeRemaining.match(/(\d+)일 (\d+)시간 (\d+)분 (\d+)초/);
                  if (!match) return <div>{timeRemaining}</div>;
                  
                  const [, days, hours, minutes, seconds] = match;
                  
                  return (
                    <>
                      <div className="timer-unit">
                        <div className="timer-digits">
                          <div className="timer-digit">{days.padStart(2, '0')[0]}</div>
                          <div className="timer-digit">{days.padStart(2, '0')[1]}</div>
                        </div>
                        <div className="timer-label-text">DAYS</div>
                      </div>
                      
                      <div className="timer-separator">:</div>
                      
                      <div className="timer-unit">
                        <div className="timer-digits">
                          <div className="timer-digit">{hours.padStart(2, '0')[0]}</div>
                          <div className="timer-digit">{hours.padStart(2, '0')[1]}</div>
                        </div>
                        <div className="timer-label-text">HRS</div>
                      </div>
                      
                      <div className="timer-separator">:</div>
                      
                      <div className="timer-unit">
                        <div className="timer-digits">
                          <div className="timer-digit">{minutes.padStart(2, '0')[0]}</div>
                          <div className="timer-digit">{minutes.padStart(2, '0')[1]}</div>
                        </div>
                        <div className="timer-label-text">MIN</div>
                      </div>
                      
                      <div className="timer-separator">:</div>
                      
                      <div className="timer-unit">
                        <div className="timer-digits">
                          <div className="timer-digit">{seconds.padStart(2, '0')[0]}</div>
                          <div className="timer-digit">{seconds.padStart(2, '0')[1]}</div>
                        </div>
                        <div className="timer-label-text">SEC</div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>

      {noticeVisible && <Notice />}

      <div id="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>SSIM</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardLoading ?
              <tr style={{ 'textAlign': 'center' }}>
                <td colSpan={4}>
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">로딩 중...</span>
                  </div>
                </td>
              </tr> :
              currentLeaderboard.length === 0 ?
              <tr style={{ 'textAlign': 'center' }}>
                <td colSpan={4}>아직 제출한 팀이 없어요. 첫 번째 제출의 주인공이 되어보세요!</td>
              </tr> :
              currentLeaderboard.map((teamInfo) => (
                <tr key={`${teamInfo.team}-rank${teamInfo.rank}`} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                  <td className="score">{teamInfo.score ? teamInfo.score.toFixed(4) : 'N/A'}</td>
                  <td className="timestamp">{parseDateString(teamInfo.timestamp)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!leaderboardLoading && currentLeaderboard.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setLeaderboardPage(prev => Math.max(1, prev - 1))}
            disabled={leaderboardPage === 1}
          >
            Previous
          </button>
          <span>Page {leaderboardPage} of {leaderboardTotalPages}</span>
          <button
            onClick={() => setLeaderboardPage(prev => Math.min(leaderboardTotalPages, prev + 1))}
            disabled={leaderboardPage === leaderboardTotalPages}
          >
            Next
          </button>
        </div>
      )}

      <div id="last-submissions-container">
        <h2>Last Submissions</h2>
        <div id="last-submissions">
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Team</th>
                <th>SSIM</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {lastSubmissionsLoading ?
                <tr style={{ 'textAlign': 'center' }}>
                  <td colSpan={4}>
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <span className="loading-text">로딩 중...</span>
                    </div>
                  </td>
                </tr> :
                currentLastSubmissions.length === 0 ?
                <tr style={{ 'textAlign': 'center' }}>
                  <td colSpan={4}>아직 제출한 팀이 없어요. 첫 번째 제출의 주인공이 되어보세요!</td>
                </tr> :
                currentLastSubmissions.map((submission) => (
                  <tr key={`${submission.team}-idx${submission.idx}`}>
                    <td className="rank">{submission.idx}</td>
                    <td className="name">{submission.team}</td>
                    <td className="score">{isParsableFloat(submission.score) ? Number(submission.score).toFixed(4) : '0.????'}</td>
                    <td className="timestamp">{parseDateString(submission.timestamp)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!lastSubmissionsLoading && currentLastSubmissions.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => setLastSubmissionsPage(prev => Math.max(1, prev - 1))}
              disabled={lastSubmissionsPage === 1}
            >
              Previous
            </button>
            <span>Page {lastSubmissionsPage} of {lastSubmissionsTotalPages}</span>
            <button
              onClick={() => setLastSubmissionsPage(prev => Math.min(lastSubmissionsTotalPages, prev + 1))}
              disabled={lastSubmissionsPage === lastSubmissionsTotalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
