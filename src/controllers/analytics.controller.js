import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { pool } from "../utils/postgress.js";
import { ApiResponse } from "../utils/response.api.js";

export const getAnalyticsController = catchAsync(async (req, res) => {
  const { creator_id, username } = req.creator;

  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    throw new ApiError(
      400,
      "Start date and end date and creator_id and username are required "
    );
  }

  try {
    // Use the provided epoch timestamps directly
    const startEpoch = parseInt(start_date);
    const endEpoch = parseInt(end_date);

    // Build tips query with optional creator_id filter
    let tipsQuery = `
            SELECT 
                COUNT(*) as tips_count,
                SUM(amount) as total_amount,
                currency
            FROM public.tips 
            WHERE created_at >= $1 AND created_at <= $2
        `;

    let queryParams = [startEpoch, endEpoch];

    // Add creator_id filter if provided
    if (creator_id) {
      tipsQuery += ` AND creator_id = $3`;
      queryParams.push(creator_id);
    }

    tipsQuery += `
            GROUP BY currency
            ORDER BY currency
        `;

    const tipsResult = await pool.query(tipsQuery, queryParams);

    // Calculate overall totals for tips
    const totalTips = tipsResult.rows.reduce(
      (sum, row) => sum + parseInt(row.tips_count),
      0
    );

    // Query events for impressions and clicks
    let eventsQuery = `
            SELECT 
                event_type,
                COUNT(*) as event_count
            FROM public.events 
            WHERE created_at >= $1 AND created_at <= $2
        `;

    let eventsParams = [startEpoch, endEpoch];
    let paramIndex = 3;

    // Add creator_id filter if provided (link events to creator via visitor_id from tips)
    if (creator_id) {
      eventsQuery += ` AND visitor_id IN (
        SELECT visitor_id FROM public.tips 
        WHERE creator_id = $${paramIndex}
      )`;
      eventsParams.push(creator_id);
      paramIndex++;
    }

    // Filter for username path if provided
    if (username) {
      eventsQuery += ` AND path = $${paramIndex}`;
      eventsParams.push(`/${username}`);
      paramIndex++;
    }

    eventsQuery += `
            AND event_type IN ('page_view', 'checkout')
            GROUP BY event_type
            ORDER BY event_type
        `;

    const eventsResult = await pool.query(eventsQuery, eventsParams);

    // Process events data
    const eventsData = {
      impressions: 0,
      clicks: 0,
    };

    eventsResult.rows.forEach((row) => {
      if (row.event_type === "page_view") {
        eventsData.impressions = parseInt(row.event_count);
      } else if (row.event_type === "checkout") {
        eventsData.clicks = parseInt(row.event_count);
      }
    });

    const analytics = {
      date_range: {
        start_date,
        end_date,
      },
      ...(creator_id && { creator_id }),
      ...(username && { username }),
      summary: {
        total_tips: totalTips,
        total_impressions: eventsData.impressions,
        total_clicks: eventsData.clicks,
        click_through_rate:
          eventsData.impressions > 0
            ? ((eventsData.clicks / eventsData.impressions) * 100).toFixed(2) +
              "%"
            : "0%",
        click_conversion_rate:
          totalTips > 0
            ? ((totalTips / eventsData.clicks) * 100).toFixed(2) + "%"
            : "0%",
      },
      breakdown_by_currency: tipsResult.rows.map((row) => ({
        currency: row.currency,
        tips_count: parseInt(row.tips_count),
        total_amount: parseFloat(row.total_amount),
      })),
      events: {
        impressions: eventsData.impressions,
        clicks: eventsData.clicks,
        click_through_rate:
          eventsData.impressions > 0
            ? ((eventsData.clicks / eventsData.impressions) * 100).toFixed(2) +
              "%"
            : "0%",
        click_conversion_rate:
          totalTips > 0
            ? ((totalTips / eventsData.clicks) * 100).toFixed(2) + "%"
            : "0%",
      },
    };

    return res.json(new ApiResponse(200, analytics));
  } catch (error) {
    console.error("Analytics query error:", error);
    throw new ApiError(500, "Failed to retrieve analytics data");
  }
});
