INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer', 'password', 'tester', '1');
INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'John', 'Doe');
INSERT INTO trainers (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Jane', 'Smith');
INSERT INTO members (email, password, first_name, last_name) VALUES ('member', 'password', 'tester', '1');
INSERT INTO members (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'John', 'Doe');
INSERT INTO members (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Jane', 'Smith');
INSERT INTO staff (email, password, first_name, last_name) VALUES ('admin', 'password', 'tester', '1');
INSERT INTO staff (email, password, first_name, last_name) VALUES ('trainer1@example.com', 'password1', 'John', 'Doe');
INSERT INTO staff (email, password, first_name, last_name) VALUES ('trainer2@example.com', 'password2', 'Jane', 'Smith');
INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (1, 'Monday: Cardio, Tuesday: Upper body workout, Wednesday: Rest', 'Lose 10 pounds in 2 months', 'Weight: 160 lbs, Blood pressure: 120/80');
INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (2, 'Monday: Lower body workout, Tuesday: Yoga, Wednesday: Cardio', 'Increase muscle mass by 5%', 'Weight: 180 lbs, Blood pressure: 130/85');
INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES (3, 'Monday: Rest, Tuesday: HIIT, Wednesday: Upper body workout', 'Improve endurance and stamina', 'Weight: 150 lbs, Blood pressure: 115/75');
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (1, 60, '2024-04-15', false);
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (2, 60, '2024-04-20', false);
INSERT INTO billing (member_id, amount, due_date, paid) VALUES (3, 60, '2024-04-25', true);

INSERT INTO schedule(trainer_id, days_free, start_time, end_time) 
VALUES 
(1, 'Wednesday', '09:00', '10:00'), (1, 'Wednesday', '10:00', '11:00'),(2, 'Wednesday', '13:00', '14:00'), (3, 'Wednesdsay', '16:00', '17:00'), (3, 'Wednesdsay', '18:00', '19:00');

INSERT INTO personalsessions (member_id, trainer_id, time_slot_id, booked_date, booked_time)
VALUES (1, 1, 1, '2024-04-10', '10:00:00');

