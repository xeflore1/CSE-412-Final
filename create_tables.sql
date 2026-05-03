DROP TABLE Users CASCADE;
DROP TABLE Donors CASCADE;
DROP TABLE HospitalStaff CASCADE;
DROP TABLE BloodUnits CASCADE;
DROP TABLE Appointments CASCADE;
DROP TYPE aptStatus;

CREATE TABLE Users (
    userID INTEGER PRIMARY KEY, 
    userName VARCHAR (30) NOT NULL, 
    email VARCHAR(60) UNIQUE NOT NULL, 
    pw VARCHAR (255) NOT NULL
);

CREATE TABLE Donors (
    userID INTEGER PRIMARY KEY references Users (userID) ON DELETE CASCADE, 
    bloodType VARCHAR(4) DEFAULT NULL
        CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    dob DATE NOT NULL
);

CREATE TABLE Hospitalstaff (
    userID INTEGER PRIMARY KEY references Users (userID) ON DELETE CASCADE, 
    jobTitle VARCHAR(25) NOT NULL
);

CREATE TYPE aptStatus AS ENUM ('ongoing', 'completed', 'cancelled');

CREATE TABLE Appointments (
    appointmentID INTEGER PRIMARY KEY, 
    donorID INTEGER references Donors (userID) NOT NULL, 
    staffID INTEGER references Hospitalstaff (userID) NOT NULL, 
    dateOfAppt DATE NOT NULL, 
    status aptStatus DEFAULT 'ongoing'
);

CREATE TABLE BloodUnits (
    unitID INTEGER PRIMARY KEY, 
    appointmentID INTEGER references Appointments (appointmentID) NOT NULL, 
    bloodType VARCHAR (4) DEFAULT NULL
        CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    volume_ml NUMERIC (7,3),
    isAvailable BOOLEAN NOT NULL DEFAULT TRUE, 
    dateDrawn DATE DEFAULT CURRENT_DATE, 
    notes TEXT DEFAULT NULL
);

CREATE UNIQUE INDEX one_appt_at_a_time
ON Appointments (donorID)
WHERE status = 'ongoing';



-- Generate 50 users
INSERT INTO Users (userid, userName, email, pw)
SELECT 
	i,
    'User ' || i,
    'user' || i || '@email.com',
    'hashedpw' || i
FROM generate_series(1, 50) AS i;

-- Make half donors, half staff
INSERT INTO Donors (userID, bloodType, dob)
SELECT 
    userID,
    (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])[floor(random()*8+1)],
    '1970-01-01'::DATE + (random() * 20000)::INTEGER
FROM Users
WHERE userID <= 25;


INSERT INTO HospitalStaff (userID, jobTitle)
SELECT 
    userID,
    (ARRAY['Nurse','Doctor','Technician','Phlebotomist'])[floor(random()*4+1)]
FROM Users
WHERE userID > 25;

INSERT INTO Appointments (appointmentID, donorID, staffID, dateOfAppt, status)
SELECT 
    i,
    i,
    floor(random() * 25 + 26),
    '2020-01-01'::DATE + (random() * 2000)::INTEGER,
    (ARRAY['ongoing', 'completed', 'cancelled'])[floor(random()*3+1)]::aptStatus
FROM generate_series(1, 25) AS i;


INSERT INTO BloodUnits (unitID, appointmentID, bloodType, volume_ml, isAvailable, dateDrawn)
SELECT
    row_number() OVER () AS unitID,
    a.appointmentID,
    d.bloodType,
    (random() * 200 + 400)::NUMERIC(7,3),
    TRUE,
    a.dateOfAppt
FROM Appointments a
JOIN Donors d ON a.donorID = d.userID
WHERE a.status = 'completed';


-- select 1
SELECT
	u.userName,
	d.userID as donorID,
	bu.unitID,
	bu.dateDrawn,
	bu.bloodType,
	bu.isAvailable
FROM Users u
JOIN Donors d on d.userID = u.userID
JOIN Appointments a on d.userID = a.donorID
JOIN BloodUnits bu on a.appointmentID = bu.appointmentID
WHERE bu.bloodType = 'O-' and bu.isAvailable is TRUE;

-- select 2
SELECT
	a.appointmentID,
	a.dateofAppt,
	a.status,
	donorUser.userName AS donorName,
	staffUser.userName as staffName,
	donor.bloodType as donorBloodType
FROM Appointments a
JOIN Donors donor on a.DonorID = donor.userID
JOIN Users donorUSer on donor.userID = donorUser.userID
JOIN HospitalStaff hs on a.staffID = hs.userID
JOIN Users staffUser on hs.userID = staffUser.userID
WHERE a.status = 'ongoing';


-- insert 
BEGIN;

WITH 
next_user_id AS (
    SELECT COALESCE(MAX(userID), 0) + 1 AS new_id FROM Users
),
next_appt_id AS (
    SELECT COALESCE(MAX(appointmentID), 0) + 1 AS new_id FROM Appointments
),
new_user AS (
    INSERT INTO Users (userID, userName, email, pw)
    SELECT new_id, 'Test Donor', 'donor@example.com', 'hashed_pw'
    FROM next_user_id
    RETURNING userID
),
new_donor AS (
    INSERT INTO Donors (userID, bloodType, dob)
    SELECT userID, 'A+', '1985-07-20'
    FROM new_user
    RETURNING userID
)
INSERT INTO Appointments (appointmentID, donorID, staffID, dateOfAppt)
SELECT (SELECT new_id FROM next_appt_id), userID, 36, '2026-04-10'
FROM new_donor;

COMMIT;

-- view execution result
SELECT 
    a.appointmentID,
    a.dateOfAppt,
    a.status,
    donorUser.userName AS donorName,
    donor.bloodType AS donorBloodType,
    donor.dob AS donorDOB,
    staffUser.userName AS staffName,
    hs.jobTitle AS staffJobTitle
FROM Appointments a
JOIN Donors donor ON a.donorID = donor.userID
JOIN Users donorUser ON donor.userID = donorUser.userID
JOIN Hospitalstaff hs ON a.staffID = hs.userID
JOIN Users staffUser ON hs.userID = staffUser.userID
ORDER BY a.appointmentID DESC
LIMIT 1;


-- update
UPDATE Donors
SET bloodType = 'A+'
where userID = 10;


-- delete
BEGIN TRANSACTION;
-- Delete blood units linked to this donor's appointments
DELETE FROM BloodUnits
WHERE appointmentID IN (SELECT appointmentID FROM Appointments WHERE donorID = 8);
-- Delete the donor's appointments
DELETE FROM Appointments WHERE donorID = 8;
-- Delete the user 
DELETE FROM Users WHERE userID = 8;
COMMIT;

Select * from users
LIMIT 10;