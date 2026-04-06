import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { calculateResult } from '@/lib/questionnaire/questions';

// Ensure table exists
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS questionnaire_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      answers JSONB NOT NULL,
      overall_score INTEGER NOT NULL,
      risk_band TEXT NOT NULL,
      profile_slug TEXT NOT NULL,
      section_scores JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  tableReady = true;
}

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureTable();

  const rows = await sql`
    SELECT answers, overall_score, risk_band, profile_slug, section_scores, updated_at
    FROM questionnaire_results
    WHERE user_id = ${session.user.id}
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json(null);
  }

  const row = rows[0]!;
  return NextResponse.json({
    answers: row.answers,
    result: {
      overallScore: row.overall_score,
      riskBand: row.risk_band,
      profileSlug: row.profile_slug,
      sectionScores: row.section_scores,
    },
    updatedAt: row.updated_at,
  });
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { answers } = body as { answers: Record<string, number | number[]> };

  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
  }

  const result = calculateResult(answers);

  await ensureTable();

  // Upsert: update if exists, insert if not
  const existing = await sql`
    SELECT id FROM questionnaire_results
    WHERE user_id = ${session.user.id}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE questionnaire_results
      SET answers = ${JSON.stringify(answers)},
          overall_score = ${result.overallScore},
          risk_band = ${result.riskBand},
          profile_slug = ${result.profileSlug},
          section_scores = ${JSON.stringify(result.sectionScores)},
          updated_at = now()
      WHERE id = ${existing[0]!.id}
    `;
  } else {
    await sql`
      INSERT INTO questionnaire_results (user_id, answers, overall_score, risk_band, profile_slug, section_scores)
      VALUES (
        ${session.user.id},
        ${JSON.stringify(answers)},
        ${result.overallScore},
        ${result.riskBand},
        ${result.profileSlug},
        ${JSON.stringify(result.sectionScores)}
      )
    `;
  }

  return NextResponse.json({
    answers,
    result,
  });
}
