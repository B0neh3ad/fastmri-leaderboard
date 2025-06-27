"use client"

import { useEffect, useState } from "react";
import './page.css';

interface TeamInfo {
    rank: number;
    team: string;
    score: number;
};

export default function Home() {
  const [data, setData] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());
  const [hideZero, SetHideZero] = useState<boolean>(false);

  useEffect(() => {
    const API_URL = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_SHEET_ID}/exec`;

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
                <th>순위</th>
                <th>팀명</th>
                <th>SSIM</th>
              </tr>
            </thead>
            <tbody>
              {data.map((teamInfo, idx) => (
                (!hideZero || teamInfo.score !== 0) && 
                <tr key={teamInfo.team} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                  <td className="score">{teamInfo.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          } */}
          <div style={{'textAlign': 'center'}}>준비 중입니다.</div>
      </div>
    </main>
  );
}
