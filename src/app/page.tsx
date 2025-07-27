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

  const API_URL = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_SHEET_ID}/exec`;
  // const API_URL = `https://script.google.com/macros/s/AKfycbxkxu5x6TsV-8OODevlhpOgDwUNNltSLtyCP3Q_Ck4/dev`;

  const fetchLeaderboard = () => {
    setLeaderboardLoading(true);
    fetch(`${API_URL}?path=leaderboard`)
      .then((response) => response.json())
      .then((result) => {
        console.log('Leaderboard data:', result);
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
        console.log('Last submissions data:', result);
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
              <tr style={{ 'textAlign': 'center' }}>
                <td colSpan={4}>로딩 중...</td>
              </tr> :
              currentLeaderboard.map((teamInfo) => (
                <tr key={`${teamInfo.team}-rank${teamInfo.rank}`} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                  <td className="score">{teamInfo.score || 'N/A'}</td>
                  <td className="timestamp">{parseDateString(teamInfo.timestamp)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!leaderboardLoading && (
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
                  <td colSpan={4}>로딩 중...</td>
                </tr> :
                currentLastSubmissions.map((submission) => (
                  <tr key={`${submission.team}-idx${submission.idx}`}>
                    <td className="rank">{submission.idx}</td>
                    <td className="name">{submission.team}</td>
                    <td className="score">{submission.score || 'N/A'}</td>
                    <td className="timestamp">{parseDateString(submission.timestamp)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
