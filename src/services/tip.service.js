import { pool } from "../utils/postgress.js";

export const getTips = async (
  creator_id,
  start_date,
  end_date,
  page = 1,
  limit = 100
) => {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      t.id,
      t.visitor_id,
      t.creator_id,
      t.amount,
      t.currency,
      t.message,
      t.payment_gateway,
      t.payment_id,
      t.created_at,
      u.name as visitor_name,
      u.email as visitor_email,
      u.phone as visitor_phone
    FROM public.tips t
    LEFT JOIN public.users u ON t.visitor_id = u.visitor_id
    WHERE t.creator_id = $1
  `;

  const params = [creator_id];

  if (start_date) {
    query += ` AND t.created_at >= $${params.length + 1}`;
    params.push(start_date);
  }

  if (end_date) {
    query += ` AND t.created_at <= $${params.length + 1}`;
    params.push(end_date);
  }

  query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

export const getTipsCount = async (creator_id, start_date, end_date) => {
  let query = `
    SELECT COUNT(*) as total
    FROM public.tips t
    WHERE t.creator_id = $1
  `;

  const params = [creator_id];

  if (start_date) {
    query += ` AND t.created_at >= $${params.length + 1}`;
    params.push(start_date);
  }

  if (end_date) {
    query += ` AND t.created_at <= $${params.length + 1}`;
    params.push(end_date);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].total);
};

export const getUnsettledTips = async (creator_id) => {
  let query = `
    SELECT * FROM public.tips WHERE creator_id = $1 AND settled = false
  `;

  const params = [creator_id];

  const result = await pool.query(query, params);
  return result.rows;
};
