  SELECT t.first_name, t.last_name, s.session_type, s.booked_date, sch.start_time, sch.end_time, s.session_id
  FROM (
    SELECT 'Personal' as session_type, booked_date, time_slot_id, trainer_id, session_id
    FROM personalsessions
    WHERE member_id = $1
    UNION ALL
    SELECT 'Group   ' as session_type, booked_date, time_slot_id, trainer_id, session_id
    FROM groupsessions
    WHERE session_id IN (
      SELECT session_id FROM sessionmembers WHERE member_id = $1
    )
  ) s
  JOIN trainers t ON s.trainer_id = t.trainer_id
  JOIN schedule sch ON s.time_slot_id = sch.time_slot_id
  ORDER BY s.booked_date, sch.start_time;
