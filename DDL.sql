DROP TABLE IF EXISTS groupsessions CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS personalsessions;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS equipments;
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS sessionmembers;
DROP TABLE IF EXISTS dashboard; 

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY, -- this is our membership id 
    email VARCHAR(255)  NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE dashboard(
    member_id int PRIMARY KEY,
    exercise_routines TEXT,
    fitness_goals TEXT,
    health_metrics TEXT,
    FOREIGN KEY(member_id) REFERENCES members
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    email VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE billing (
    member_id INT PRIMARY KEY,
    amount INT,
    due_date DATE,
    paid BOOLEAN,
    FOREIGN KEY(member_id) REFERENCES members
);

CREATE TABLE equipments(
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    status BOOLEAN,
    room_location VARCHAR(255) NOT NULL
);

CREATE TABLE room(
    room_id SERIAL PRIMARY KEY,
    room_location VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME
);

CREATE TABlE trainers(
    trainer_id SERIAL PRIMARY KEY,
    email VARCHAR(255)  NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE schedule(
    time_slot_id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,
    days_free VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers
);

--Keeps track of all personal sessions booked by MEMBER
CREATE TABLE personalsessions(
    session_id SERIAL PRIMARY KEY,
    member_id INT NOT NULL,
    trainer_id INT NOT NULL,  --Not sure if we incldue this, might be redundant since TIME SLOTS has trainer
    time_slot_id INT NOT NULL,
    booked_date DATE,
    booked_time TIME,      -- SAME THING WITH THIS: 
    FOREIGN KEY(member_id) REFERENCES members,
    FOREIGN KEY(time_slot_id) REFERENCES schedule(time_slot_id),
    FOREIGN KEY(trainer_id) REFERENCES trainers
);

CREATE TABLE groupsessions(
    session_id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,   --See above
    time_slot_id INT NOT NULL,
    booked_date DATE,
    booked_time TIME,
    session_type VARCHAR(225) NOT NULL, 
    room_id INT NOT NULL, -- should this be a foreign key to room table or the other way around?
    FOREIGN KEY(trainer_id) REFERENCES trainers,
    FOREIGN KEY(time_slot_id) REFERENCES schedule(time_slot_id)
);
-- ALTER TABLE groupsessions -- makes sure that the groupsessions room_id matches to a room room_id? do we want this? adding a constraint?
-- ADD CONSTRAINT fk_room_id
-- FOREIGN KEY (room_id) REFERENCES room(room_id);

CREATE TABLE sessionmembers(
    session_id INT,
    member_id INT,
    PRIMARY KEY (session_id, member_id),
    FOREIGN KEY (session_id) REFERENCES groupsessions(session_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id)
);
