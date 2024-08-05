"use client"

import { useEffect, useState } from "react";
import './page.css';
import { TeamInfo } from "./api/sheet-data/route";
import { useRouter } from "next/router";

function formatDateTime(now: Date) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${date}일 ${hours}:${minutes}`
}

export default function Home() {
  const [data, setData] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setNow(new Date());
    setLoading(true);
    fetch('/api/sheet-data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <header>
        <h1>2024 SNU FastMRI Challenge Leaderboard</h1>
        <p>Last Update: {formatDateTime(now)}</p>
      </header>
      <div id="leaderboard">
        {loading ?
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
                <tr key={teamInfo.name} className={teamInfo.rank <= 5 ? "top" : ""}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.name}</td>
                  <td className="score">{teamInfo.ssimScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
          }
      </div>
    </main>
  );
}
