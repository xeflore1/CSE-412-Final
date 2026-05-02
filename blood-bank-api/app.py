# soon to be backend
from flask import Flask, jsonify, request
from flask_cors import CORS
#from argon2 import PasswordHasher
import psycopg2

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


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        #TODO hash the login input password before comparing it with tuples in the DB

        # Validate user from frontend
        conn = get_db_conn()
        cur = conn.cursor()
        get_user_query = '''
            select 
                users.userid, 
                donors.userid as donorid, 
                hospitalstaff.userid as staffid
            from users
            left join donors on donors.userid = users.userid
            left join hospitalstaff on hospitalstaff.userid = users.userid
            where username = %s and pw = %s; 
        '''
        cur.execute(get_user_query, (username, password)) 
        res = cur.fetchone()
        cur.close()
        conn.close()

        # if no results, then return 401
        if not res:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # if successful results, then return 200
        user_id = res[0]
        if res[1]: user_type = "Donor"
        elif res[2]: user_type = "Staff"
        return jsonify({
            "userId": user_id,
            "userType": user_type
        }), 200
    except Exception as e:
                return jsonify({"error": "Issue with the server"}), 500
    
@app.route("/donor/<int:userId>", methods=["GET"])
def get_donor_info(userId):
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
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({
            "username": res[0],
            "email": res[1],
            "bloodType": res[2],
            "dob": res[3]
        })
    except Exception as e:
        return jsonify({"error": "Issue with the server"}), 500

if __name__ == "__main__":
    app.run(debug=True)