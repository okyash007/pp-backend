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


export const getTipsByCreatorId = async (creator_id, page = 1, limit = 100) => {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  let query = `
    SELECT * FROM public.tips 
    WHERE creator_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const params = [creator_id, limit, offset];

  const result = await pool.query(query, params);
  return result.rows;
};

export const getTipsByCreatorIdCount = async (creator_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM public.tips
    WHERE creator_id = $1
  `;

  const params = [creator_id];

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].total);
};

export const getAmountsByCreatorId = async (creator_id) => {
  const query = `
    SELECT 
      COALESCE(SUM(amount), 0) as total_collected,
      COALESCE(SUM(CASE WHEN settled = true THEN amount * 0.95 ELSE 0 END), 0) as total_settled,
      COALESCE(SUM(CASE WHEN settled = false THEN amount * 0.95 ELSE 0 END), 0) as total_unsettled
    FROM public.tips
    WHERE creator_id = $1
  `;

  const params = [creator_id];
  const result = await pool.query(query, params);

  return {
    collected_amount: parseFloat(result.rows[0].total_collected) || 0,
    settled_amount: parseFloat(result.rows[0].total_settled) || 0,
    unsettled_amount: parseFloat(result.rows[0].total_unsettled) || 0,
  };
}