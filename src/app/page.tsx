"use client"

import { useEffect, useState } from "react";
import './page.css';

interface TeamInfo {
    rank: number;
    team: string;
    score: number;
    timestamp: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());
  const [hideZero, SetHideZero] = useState<boolean>(false);

  useEffect(() => {
    const API_URL = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_SHEET_ID}/exec`;
    // const API_URL = `https://script.google.com/macros/s/AKfycbym6hkfpo22xVReAqyE4QApacer0vbkSzo4IlnTkS8/dev`;

    setNow(new Date());
    setLoading(true);
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <header>
        <h1>2025 SNU FastMRI Challenge Leaderboard</h1>
      </header>
      <div id="leaderboard">
        {/* {loading ?
          <div style={{'textAlign': 'center'}}>로딩 중...</div> :
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
              {data.map((teamInfo, idx) => (
                (!hideZero || teamInfo.score !== 0) && 
                <tr key={teamInfo.team} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                  <td className="score">{teamInfo.score}</td>
                  <td className="timestamp">{parseDateString(teamInfo.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          } */}
          <div style={{'textAlign': 'center', 'marginBottom': '2rem'}}>준비 중입니다.<br />(8월 이후 leaderboard 공개 예정)</div>
      </div>
    </main>
  );
}
