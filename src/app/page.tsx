"use client"

import { useEffect, useState } from "react";
import './page.css';

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
    score: number;
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

export default function Home() {
  const [data, setData] = useState<TeamInfo[]>([]);
  const [lastSubmissions, setLastSubmissions] = useState<LastSubmission[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);
  const [lastSubmissionsLoading, setLastSubmissionsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastSubmissionsPage, setLastSubmissionsPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastSubmissionsTotalPages, setLastSubmissionsTotalPages] = useState<number>(1);

  const API_URL = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_SHEET_ID}/exec`;
  // const API_URL = `https://script.google.com/macros/s/AKfycbxkxu5x6TsV-8OODevlhpOgDwUNNltSLtyCP3Q_Ck4/dev`;

  const fetchLeaderboard = (page: number) => {
    setLeaderboardLoading(true);
    fetch(`${API_URL}?path=leaderboard&page=${page}`)
      .then((response) => response.json())
      .then((result) => {
        console.log('Leaderboard data:', result);
        setData(result.data || result);
        setTotalPages(result.totalPages || 1);
        setLeaderboardLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardLoading(false);
      });
  };

  const fetchLastSubmissions = (page: number) => {
    setLastSubmissionsLoading(true);
    fetch(`${API_URL}?path=last-submission&page=${page}`)
      .then((response) => response.json())
      .then((result) => {
        console.log('Last submissions data:', result);
        setLastSubmissions(result.data || result);
        setLastSubmissionsTotalPages(result.totalPages || 1);
        setLastSubmissionsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching last submissions:', error);
        setLastSubmissionsLoading(false);
      });
  };

  useEffect(() => {
    setNow(new Date());
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchLastSubmissions(lastSubmissionsPage);
  }, [lastSubmissionsPage]);

  return (
    <main>
      <header>
        <h1>2025 SNU FastMRI Challenge Leaderboard</h1>
      </header>
      <div id="leaderboard">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>SSIM</th>
                <th>Last Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardLoading ?
                <tr style={{'textAlign': 'center'}}>
                  <td colSpan={4}>로딩 중...</td>
                </tr> :
                data.map((teamInfo) => (
                <tr key={`${teamInfo.team}-rank${teamInfo.rank}`} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                  <td className="score">{teamInfo.score || 'N/A'}</td>
                  <td className="timestamp">{parseDateString(teamInfo.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div style={{'textAlign': 'center', 'marginBottom': '2rem'}}>준비 중입니다.<br />(8월 이후 leaderboard 공개 예정)</div> */}
      </div>
      
      {!leaderboardLoading && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      
      <div id="last-submissions">
        <h2>Last Submissions</h2>
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
                <tr style={{'textAlign': 'center'}}>
                  <td colSpan={4}>로딩 중...</td>
                </tr> :
                lastSubmissions.map((submission) => (
                <tr key={`${submission.team}-idx${submission.idx}`}>
                  <td className="rank">{submission.idx}</td>
                  <td className="name">{submission.team}</td>
                  <td className="score">{submission.score || 'N/A'}</td>
                  <td className="timestamp">{parseDateString(submission.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        
        {!lastSubmissionsLoading && (
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
