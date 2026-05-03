#!/usr/bin/env python3

import psycopg2
from argon2 import PasswordHasher

DB_HOST = "localhost"
DB_NAME = "bloodbank_412_PROJECT"
DB_USER="postgres"
DB_PASS="cse412"
DB_PORT="5432"

ph = PasswordHasher()

print("Connecting to database...")
conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT)
conn.autocommit = False
cur = conn.cursor()

try:
    # Users
    print("Inserting users (hashing passwords)...")
    for i in range(1, 51):
        cur.execute(
            "INSERT INTO Users (userName, email, pw) VALUES (%s, %s, %s)",
            (f"User {i}", f"user{i}@email.com", ph.hash(f"hashedpw{i}"))
        )
    print("50 users inserted")

    # Donors
    print("Inserting donors...")
    cur.execute("""
        INSERT INTO Donors (userID, bloodType, dob)
        SELECT 
            userID,
            (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])[floor(random()*8+1)],
            '1970-01-01'::DATE + (random() * 20000)::INTEGER
        FROM Users
        WHERE userID <= 25
    """)
    print(f"{cur.rowcount} donors inserted")

    # Hospital Staff
    print("Inserting hospital staff...")
    cur.execute("""
        INSERT INTO HospitalStaff (userID, jobTitle)
        SELECT 
            userID,
            (ARRAY['Nurse','Doctor','Technician','Phlebotomist'])[floor(random()*4+1)]
        FROM Users
        WHERE userID > 25
    """)
    print(f"{cur.rowcount} staff inserted")

    # Appointments
    print("Inserting appointments...")
    cur.execute("""
        INSERT INTO Appointments (donorID, staffID, dateOfAppt, status)
        SELECT 
            i,
            floor(random() * 25 + 26)::INTEGER,
            '2020-01-01'::DATE + (random() * 2000)::INTEGER,
            (ARRAY['ongoing', 'completed', 'cancelled'])[floor(random()*3+1)]::aptStatus
        FROM generate_series(1, 25) AS i
    """)
    print(f"{cur.rowcount} appointments inserted")

    # Blood Units
    print("Inserting blood units...")
    cur.execute("""
        INSERT INTO BloodUnits (appointmentID, bloodType, volume_ml, isAvailable, dateDrawn)
        SELECT
            a.appointmentID,
            d.bloodType,
            (random() * 200 + 400)::NUMERIC(7,3),
            TRUE,
            a.dateOfAppt
        FROM Appointments a
        JOIN Donors d ON a.donorID = d.userID
        WHERE a.status = 'completed'
    """)
    print(f"{cur.rowcount} blood units inserted")

    conn.commit()
    print("\nDatabase seeded successfully!")

except Exception as e:
    conn.rollback()
    print(f"\nSeeding failed, transaction rolled back.\n   Error: {e}")

finally:
    cur.close()
    conn.close()
