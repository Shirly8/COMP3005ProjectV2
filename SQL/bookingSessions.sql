  
  --DISPLAYS ALL THE PERSONAL AND GROUP SESSIONS FOR MEMBERS WITH THESE CONSTRAINTS

  -- Selects FROM personalsessions and groupsessions DISPLAYING AS Personal or Groups
  -- Ensuring these tables matches the member_id to the members table
  -- Pulls out the dates according to the schedules table with time slots
  SELECT t.first_name, t.last_name, s.session_type, s.booked_date, sch.start_time, sch.end_time,
    CASE
    WHEN s.session_type = 'Personal' THEN CONCAT('P', s.session_id)
    WHEN s.session_type = 'Group   ' THEN CONCAT('G', s.session_id)
  END as session_id
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
