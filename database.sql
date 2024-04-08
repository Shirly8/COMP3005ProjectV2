DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS administrativestaff;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS members;

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    email VARCHAR(255)  NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    health_metrics TEXT,
    fitness_goals TEXT
);

CREATE TABLE memberships(
    member_id SERIAL PRIMARY KEY,
    amount INT,
    join_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(member_id) REFERENCES members
);

CREATE TABLE administrativestaff(
    staff_id SERIAL PRIMARY KEY,
    email VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE billing (
    member_id SERIAL PRIMARY KEY,
    amount INT,
    due_date DATE,
    paid BOOLEAN,
    FOREIGN KEY(member_id) REFERENCES members,
    FOREIGN KEY(amount) REFERENCES memberships
);

CREATE TABLE equipment(
    equipment_id SERIAL PRIMARY KEY,
    booked_date DATE,
    booked_time TIME,
    member_id INT,
    FOREIGN KEY(member_id) REFERENCES members
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
    last_name VARCHAR(255) NOT NULL,
    schedule TEXT --CHANGE????
);