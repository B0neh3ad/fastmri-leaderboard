import './page.css';

interface FinalTeamInfo {
  rank: number;
  team: string;
};

export default function Final() {
  const FinalLeaderboard: FinalTeamInfo[] = [
    { rank: 1, team: "SNUNet" },
    { rank: 2, team: "EJ" },
    { rank: 3, team: "2대1000" },
    { rank: 4, team: "sMaRtIf𝕪" },
    { rank: 5, team: "attention" },
  ]

  return (
    <main>
      <header>
        <h1>2025 SNU FastMRI Challenge Leaderboard (Final)</h1>
      </header>
      <div id="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {
              FinalLeaderboard.map((teamInfo) => (
                <tr key={`${teamInfo.team}-rank${teamInfo.rank}`} className={`rank-${teamInfo.rank} ${teamInfo.rank <= 5 ? 'top' : ''}`}>
                  <td className="rank">{teamInfo.rank}</td>
                  <td className="name">{teamInfo.team}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </main >
  );
}