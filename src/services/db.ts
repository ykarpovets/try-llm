import "server-only";

import pg from "pg";

const pool = new pg.Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "lcuser",
  password: "lcpassword",
  database: "langchain",
});

type Candidate = {
  id: number;
  name: string;
  cv: string;
};

async function addCandidate(candidate: string, cv: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "INSERT INTO candidates (name, cv) VALUES ($1, $2) RETURNING id",
      [candidate, cv],
    );
    const id = res.rows[0].id;
    await client.query("COMMIT");
    return id;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function getCandidates(): Promise<Array<Candidate>> {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM candidates");
    return res.rows;
  } finally {
    client.release();
  }
}

async function getCandidate(id: number): Promise<Candidate> {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM candidates WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

export default pool;
export type { Candidate };
export { addCandidate, getCandidates, getCandidate };
