import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GAPI_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEETS_ID;
const RANGE = '리더보드!A4:I51';

export interface TeamInfo {
    name: string;
    ssimScore: number;
    rank: number;
};

function parseData(data: any): TeamInfo[] {
    const parsedData: TeamInfo[] = [];
    data.values.forEach((row: any) => {
        for(let i = 0; i < row.length; i += 3) {
            const newRow: TeamInfo = {
                name: row[i] || '',
                ssimScore: Number(row[i + 1]),
                rank: Number(row[i + 2]),
            };
            parsedData.push(newRow);
        }
    })
    return parsedData;
}

function compareData(a: TeamInfo, b: TeamInfo) {
    return b.ssimScore - a.ssimScore === 0 ? 
    a.name.localeCompare(b.name) : b.ssimScore - a.ssimScore;
}

export async function GET(req: NextRequest) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    const sortedData: TeamInfo[] = parseData(data).sort(compareData);

    return NextResponse.json(sortedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
