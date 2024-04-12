--FOR TRAINERS
INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer', 'password', 'Britney', 'Spears');
INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'Micheal', 'Jackson');
INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Elvis', 'Presley');

-- For Britney
INSERT INTO schedule(trainer_id, days_free, start_time, end_time) VALUES 
(1, 'Monday', '09:00', '10:00'),
(1, 'Tuesday', '10:00', '11:00'), 
(1, 'Wednesday', '13:00', '14:00'), 
(1, 'Wednesday', '15:00', '16:00'),
(1, 'Thursday', '09:00', '10:00'),
(1, 'Thursday', '11:00', '12:00'),
(1, 'Friday', '13:00', '14:00'),
(1, 'Friday', '14:00', '15:00'),
(1, 'Saturday', '09:00', '10:00'),
(1, 'Saturday', '10:00', '11:00'),
(1, 'Saturday', '11:00', '12:00'),
(1, 'Saturday', '13:00', '14:00');



-- For Micheal
INSERT INTO schedule(trainer_id, days_free, start_time, end_time) VALUES 
(2, 'Thursday', '09:00', '10:00'),
(2, 'Friday', '10:00', '11:00'), 
(2, 'Friday', '13:00', '14:00'), 
(2, 'Saturday', '14:00', '15:00'),
(2, 'Saturday', '15:00', '16:00'),
(2, 'Saturday', '11:00', '12:00'),
(2, 'Saturday', '14:00', '15:00'),
(2, 'Sunday', '11:00', '12:00'),
(2, 'Sunday', '12:00', '13:00'),
(2, 'Monday', '13:00', '14:00'),
(2, 'Monday', '14:00', '15:00'),
(2, 'Tuesday', '09:00', '10:00'),
(2, 'Tuesday', '11:00', '12:00');

-- For Elvis
INSERT INTO schedule(trainer_id, days_free, start_time, end_time) VALUES 
(3, 'Friday', '09:00', '10:00'),
(3, 'Friday', '10:00', '11:00'), 
(3, 'Friday', '11:00', '12:00'),
(3, 'Saturday', '13:00', '14:00'), 
(3, 'Saturday', '14:00', '15:00'),
(3, 'Saturday', '17:00', '18:00'),
(3, 'Sunday', '10:00', '11:00'),
(3, 'Wednesday', '13:00', '14:00'),
(3, 'Wednesday', '14:00', '15:00');


-- FOR MEMBERS: 
INSERT INTO members (email, password, first_name, last_name) VALUES ('member', 'password', 'Taylor', 'Swift');
INSERT INTO members (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'Ariana', 'Grande');
INSERT INTO members (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Justin', 'Bieber');


INSERT INTO staff (email, password, first_name, last_name) VALUES ('admin', 'password', 'Leo', 'DiCaprio');
INSERT INTO staff (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'Jackie', 'Chan');
INSERT INTO staff (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Will', 'Smith');

INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (1, 'Monday: Cardio, Tuesday: Upper body workout, Wednesday: Rest', 'Lose 10 pounds in 2 months', 'Weight: 160 lbs, Blood pressure: 120/80');
INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (2, 'Monday: Lower body workout, Tuesday: Yoga, Wednesday: Cardio', 'Increase muscle mass by 5%', 'Weight: 180 lbs, Blood pressure: 130/85');
INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (3, 'Monday: Rest, Tuesday: HIIT, Wednesday: Upper body workout', 'Improve endurance and stamina', 'Weight: 150 lbs, Blood pressure: 115/75');

-- FOR ADMINS: 
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (1, 60, '2024-04-15', false);
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (2, 60, '2024-04-20', false);
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (3, 60, '2024-04-25', true);

--FOR EQUIPMENTS
INSERT INTO equipments (equipment_name, status, room_location) VALUES ('Treadmill', false, 'Personal Room 1');
INSERT INTO equipments (equipment_name, status, room_location) VALUES ('Lat Machine', false, 'Main Exercise Room');
INSERT INTO equipments (equipment_name, status, room_location) VALUES ('Rowing Machine', true, 'Main Exercise Room');

--PERSONAL SESSIONS;
INSERT INTO personalsessions (member_id, trainer_id, time_slot_id, booked_date, booked_time) VALUES 
(1, 1, 8, '2024-04-11', '14:00:00'), 
(3, 1, 10, '2024-04-13', '10:00:00'), 
(1, 1, 12, '2024-04-13', '13:00:00'), 
(2, 1, 12, '2024-04-20', '13:00:00'), 
(2, 1, 3, '2024-04-17', '13:00:00');

-- For Michael
INSERT INTO personalsessions (member_id, trainer_id, time_slot_id, booked_date, booked_time) VALUES 
(1, 2, 13, '2024-04-11', '09:00:00'), 
(2, 2, 22, '2024-04-15', '13:00:00'), 
(3, 2, 19, '2024-04-13', '14:00:00');

-- For Elvis
INSERT INTO personalsessions (member_id, trainer_id, time_slot_id, booked_date, booked_time) VALUES 
(1, 3, 28, '2024-04-12', '11:00:00'), 
(2, 3, 31, '2024-04-13', '17:00:00'), 
(3, 3, 29, '2024-04-13', '13:00:00');

INSERT INTO rooms (room_location, event_type, start_date, start_time)
VALUES 
    ('Room 1', 'Meeting', '2024-04-12', '09:00:00'),
    ('Room 2', 'Conference', '2024-04-13', '10:30:00'),
    ('Room 3', 'Workshop', '2024-04-14', '13:00:00'),
    ('Room 4', 'Yoga', '2024-04-19', '14:00:00'), 
    ('Room 5', 'Pilates', '2024-04-13', '11:00:00'),
    ('Room 5', 'Pilates', '2024-04-20', '11:00:00'),
    ('Room 7', 'HIIT', '2024-04-19', '11:00:00'),
    ('Room 7', 'HIIT', '2024-04-13', '15:00:00'),
    ('Room 8', 'Boxing', '2024-04-20', '14:00:00'),
    ('Room 8', 'Boxing', '2024-04-13', '14:00:00');

-- Now, insert data into the groupsessions table
INSERT INTO groupsessions (trainer_id, time_slot_id, booked_date, booked_time, session_type, room_id)
 VALUES 
    (1, 8, '2024-04-19', '14:00:00', 'Yoga', 4), 
    (1, 11, '2024-04-13', '11:00:00', 'Pilates', 5),
    (1, 11, '2024-04-20', '11:00:00', 'Pilates', 6),
    (3, 28, '2024-04-19', '11:00:00', 'HIIT', 7),
    (2, 17, '2024-04-13', '15:00:00', 'HIIT', 8),
    (3, 31, '2024-04-20', '14:00:00', 'Boxing', 9),
    (3, 30, '2024-04-13', '14:00:00', 'Boxing', 10);

