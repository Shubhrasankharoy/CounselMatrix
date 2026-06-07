import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET() {
  const csvPath = path.join(process.cwd(), 'public', 'josaa_2025_final.csv');
  const fileContents = await fs.readFile(csvPath, 'utf8');

  const parsed = Papa.parse(fileContents, {
    header: true,
    skipEmptyLines: true,
  });

  return NextResponse.json({ data: parsed.data });
}
