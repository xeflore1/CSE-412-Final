# blood-bank-api/app.py

# soon to be backend
from flask import Flask, jsonify, request
from flask_cors import CORS
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import psycopg2
from datetime import datetime

ph = PasswordHasher()
app = Flask(__name__)
CORS(app)


def get_db_conn():
    '''
    Gets a connection to blood bank db.
    :return: A connection to the db.
    '''
    
    #TODO change for your environment
    conn = psycopg2.connect(
        host="localhost",
        database="bloodbank_412_PROJECT",
        user="postgres",
        password="cse412",
        port="5432"
    )
    return conn


# Register user
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email", "").strip()
        username = data.get("username", "").strip()
        password = data.get("password", "")
        is_staff = data.get("isStaff", False)

        blood_type = data.get("bloodType")
        dob = data.get("dob")
        job_title = data.get("jobTitle")

        # --- Basic validation ---
        if not email or not username or not password:
            return jsonify({"error": "Email, username, and password are required."}), 400

        if not is_staff:
            if not blood_type or not dob:
                return jsonify({"error": "Blood type and date of birth are required for donors."}), 400
        else:
            if not job_title:
                return jsonify({"error": "Job title is required for staff."}), 400

        # Hash the password 
        hashed_pw =  ph.hash(password)

        conn = get_db_conn()
        cur = conn.cursor()

        # Check if username or email already exists
        cur.execute("SELECT userid FROM users WHERE username = %s OR email = %s", (username, email))
        existing = cur.fetchone()
        if existing:
            cur.close()
            conn.close()
            return jsonify({"error": "Username or email already taken."}), 409

        insert_user_query = """
            INSERT INTO users (username, pw, email)
            VALUES (%s, %s, %s)
            RETURNING userid;
        """
        cur.execute(insert_user_query, (username, hashed_pw, email))
        user_id = cur.fetchone()[0]

        if is_staff:
            cur.execute(
                "INSERT INTO hospitalstaff (userid, jobtitle) VALUES (%s, %s)",
                (user_id, job_title)
            )
            user_type = "Staff"
        else:
            cur.execute(
                "INSERT INTO donors (userid, bloodtype, dob) VALUES (%s, %s, %s)",
                (user_id, blood_type, dob)
            )
            user_type = "Donor"

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"userId": user_id, "userType": user_type}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()   # will show the error in terminal
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Registration failed. Please try again."}), 500

# Test Database Connection
@app.route("/health", methods=["GET"])
def health_check():
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.close()
        conn.close()
        return jsonify({"status": "ok", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        conn = get_db_conn()
        cur = conn.cursor()

        # 1. Get hashed password and ids
        cur.execute('''
            SELECT 
                users.userid, 
                users.pw,
                donors.userid AS donorid, 
                hospitalstaff.userid AS staffid
            FROM users
            LEFT JOIN donors ON donors.userid = users.userid
            LEFT JOIN hospitalstaff ON hospitalstaff.userid = users.userid
            WHERE username = %s;
        ''', (username,))
        res = cur.fetchone()
        cur.close()
        conn.close()

        if not res:
            return jsonify({"error": "Invalid credentials"}), 401

        user_id, hashed_pw, donor_id, staff_id = res

        # 2. Verify password
        try:
            ph.verify(hashed_pw, password)
        except VerifyMismatchError:
            return jsonify({"error": "Invalid credentials"}), 401

        # 3. Determine user type
        if donor_id:
            user_type = "Donor"
        elif staff_id:
            user_type = "Staff"
        else:
            # User exists but is neither donor nor staff
            return jsonify({"error": "User role not found"}), 500

        return jsonify({
            "userId": user_id,
            "userType": user_type
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Issue with the server"}), 500
    


@app.route("/donor/<int:userId>", methods=["GET"])
def get_donor_info(userId):
    '''
    Gets the user info for donors, i.e. their username, email, bloodtype, and dob.
    :parameter userId: the specific userId we are getting info for
    :returns json: Returns data to the frontend in JSON format.
    '''
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        get_donor_info_query = '''
            select
                username,
                email,
                bloodtype,
                dob
            from users
            join donors on donors.userid = users.userid
            where donors.userid = %s;
        '''
        cur.execute(get_donor_info_query, (userId,)) 
        res = cur.fetchone()
        cur.close()
        conn.close()
        if not res:
            return jsonify({"error": "Something went wrong"}), 401

        return jsonify({
            "username": res[0],
            "email": res[1],
            "bloodType": res[2],
            "dob": res[3]
        })
    except Exception as e:
        return jsonify({"error": "Issue with the server"}), 500
    
@app.route("/staff/<int:userId>", methods=["GET"])
def get_staff_info(userId):
    '''
    Gets the user info for staff, i.e. their username, email, job position.
    :parameter userId: the specific userId we are getting info for
    :returns json: Returns data to the frontend in JSON format.
    '''
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        get_staff_info_query = '''
            select
                username,
                email,
                jobtitle
            from users
            join hospitalstaff on hospitalstaff.userid = users.userid
            where users.userid = %s;
        '''
        cur.execute(get_staff_info_query, (userId,)) 
        res = cur.fetchone()
        cur.close()
        conn.close()
        if not res:
            return jsonify({"error": "Something went wrong"}), 401

        return jsonify({
            "username": res[0],
            "email": res[1],
            "jobTitle": res[2]
        })
    except Exception as e:
        return jsonify({"error": "Issue with the server"}), 500

@app.route("/appts/<int:userId>", methods=["GET"])
def get_appts(userId):
    '''
    Gets the appointments for this given user.
    :parameter userId: the specific userId we are getting appointments for.
    :returns json: Returns data to the frontend in JSON format.
    '''
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        get_appts_info_query = '''
            select 
                appointmentid, 
                donorid, 
                staffid, 
                dateofappt, 
                status
            from appointments where donorid = %s or staffid = %s
            order by status desc;
        '''
        cur.execute(get_appts_info_query, (userId, userId)) 
        res = cur.fetchall()
        cur.close()
        conn.close()

        appointments = [
            {
                "appointmentID": appt[0],
                "donorID": appt[1],
                "staffID": appt[2],
                "date": appt[3],
                "status": appt[4],
            }
            for appt in res
        ]
        return jsonify(appointments), 200

    except Exception as e:
        return jsonify({"error": "Issue with the server"}), 500

@app.route("/donor/<int:userId>", methods=["PUT"])
def update_donor(userId):
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        blood_type = data.get("bloodType")
        dob = data.get("dob")

        conn = get_db_conn()
        cur = conn.cursor()

        # Update users table
        cur.execute("""
            UPDATE users
            SET username = %s,
                email = %s
            WHERE userid = %s;
        """, (username, email, userId))

        # Update donors table
        cur.execute("""
            UPDATE donors
            SET bloodtype = %s,
                dob = %s
            WHERE userid = %s;
        """, (blood_type, dob, userId))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Donor updated successfully"}), 200

    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Update failed"}), 500

@app.route("/staff/<int:userId>", methods=["PUT"])
def update_staff(userId):
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        job_title = data.get("jobTitle")

        conn = get_db_conn()
        cur = conn.cursor()

        cur.execute("""
            UPDATE users
            SET username = %s,
                email = %s
            WHERE userid = %s;
        """, (username, email, userId))

        cur.execute("""
            UPDATE hospitalstaff
            SET jobtitle = %s
            WHERE userid = %s;
        """, (job_title, userId))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Staff updated successfully"}), 200

    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Update failed"}), 500

@app.route("/appts/<int:appointmentId>", methods=["PUT"])
def update_appt(appointmentId):
    try:
        data = request.get_json()
        date = data.get("date")
        status = data.get("status")


        valid_statuses = ("ongoing", "completed", "cancelled")
        if status is not None and status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400

        conn = get_db_conn()
        cur = conn.cursor()

        set_clauses = []
        params = []
        if date is not None:
            set_clauses.append("dateofappt = %s")
            params.append(date)
        if status is not None:
            set_clauses.append("status = %s")
            params.append(status)

        if not set_clauses:
            return jsonify({"error": "No fields to update"}), 400

        params.append(appointmentId)
        query = f"UPDATE appointments SET {', '.join(set_clauses)} WHERE appointmentid = %s"
        print(f"Executing: {query} with params {params}")  # DEBUG

        cur.execute(query, params)
        rowcount = cur.rowcount
        print(f"Rows affected: {rowcount}")  # DEBUG

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Appointment updated"}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Update failed"}), 500

@app.route("/user/<int:userId>", methods=["DELETE"])
def delete_user(userId):
    try:
        conn = get_db_conn()
        cur = conn.cursor()

        # Then delete user
        cur.execute("DELETE FROM users WHERE userid = %s;", (userId,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "User deleted"}), 200

    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Delete failed"}), 500

@app.route("/appts", methods=["POST"])
def create_appointment():
    try:
        data = request.get_json()
        donor_id = data["donorId"]
        date = data["date"]

        conn = get_db_conn()
        cur = conn.cursor()

        # Find an available staff member (simple: assign one that has no ongoing appt at that date)
        cur.execute("""
            SELECT userid FROM hospitalstaff
            WHERE userid NOT IN (
                SELECT staffid FROM appointments
                WHERE dateofappt = %s AND status = 'ongoing'
            )
            LIMIT 1;
        """, (date,))
        staff = cur.fetchone()
        if not staff:
            cur.close()
            conn.close()
            return jsonify({"error": "No staff available on this date"}), 409

        staff_id = staff[0]

        cur.execute(
            "INSERT INTO appointments (donorid, staffid, dateofappt, status) " \
            "VALUES (%s, %s, %s, 'ongoing')"
            "RETURNING appointmentid;",
            (donor_id, staff_id, date)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"appointmentId": new_id}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Appointment creation failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)