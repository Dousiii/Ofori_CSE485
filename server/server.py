from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import json

from flask import request
from flask_cors import CORS
from encryption import encrypt_data, decrypt_data

app = Flask(__name__)
CORS(app)



# MySQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://ofori_database:oforiDatabase1234!@146.190.71.187/ofori'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

#Initial the Table in DataBase

#

# Admin Table
class Admin(db.Model):
    __tablename__ = 'Admin'

    Admin_id = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(50), nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(100), nullable=False)

#Event table
class Event(db.Model):
    __tablename__ = 'Event'

    Event_id = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.String(200), nullable=False)
    Date = db.Column(db.String(10), nullable=False)
    Location = db.Column(db.String(500), nullable=False)
    Total_audi = db.Column(db.Integer)

# Audience Table
class Audience(db.Model):
    __tablename__ = 'Audience'

    Audience_id = db.Column(db.Integer, primary_key=True)
    Event_id = db.Column(db.Integer, db.ForeignKey('Event.Event_id'), nullable=False)  # Foreign key referencing the Event table
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(200), nullable=False)
    Phone = db.Column(db.String(50), nullable=True)


#Initial some get all function to check it connection

#


#function to get all admin from Admin table
@app.route('/getAdmins', methods=['GET'])
def get_admins():
    admins = Admin.query.all()  #get all admins
    return jsonify([{
        'Admin_id': admin.Admin_id,
        'Username': admin.Username,
        'Password': admin.Password,
        'Email': admin.Email
    } for admin in admins])

#function to get all events from Event table
@app.route('/getEvents', methods=['GET'])
def get_events():
    events = Event.query.all()  #get all events
    return jsonify([{
        'Event_id': event.Event_id,
        'Title': event.Title,
        'Date': event.Date,
        'Location': event.Location,
        'Total_audi': event.Total_audi
    } for event in events])

#function to get all audiences from Audience table
@app.route('/getAudiences', methods=['GET'])
def get_Audience():
    audiences = Audience.query.all()  # get all audience in table
    return jsonify([
        {
            'Audience_id': audience.Audience_id,
            'Name': audience.Name,
            'Email': audience.Email,
            'Event_id': audience.Event_id,
            'Phone': audience.Phone
        } for audience in audiences])

    
# API：Encrypting Data
@app.route('/encrypt', methods=['POST'])
def encrypt_endpoint():
    data = request.json.get('data')  # Get data from POST request
    encrypted_data = encrypt_data(data)  # Using encryption functions
    return jsonify({'encrypted_data': encrypted_data.decode()})  # Returns the encrypted data

# API: Decrypting Data
@app.route('/decrypt', methods=['POST'])
def decrypt_endpoint():
    encrypted_data = request.json.get('encrypted_data')  # Get encrypted data from POST request
    decrypted_data = decrypt_data(encrypted_data.encode())  # Using the decryption function
    return jsonify({'decrypted_data': decrypted_data})  # Returns the decrypted data

@app.route('/admin_login', methods=['POST'])
def Admin_login():
    data = request.json  # Get email and password from the front end
    email = data.get('email')
    password = data.get('password')

    # Query the admin's email in the database. If the database is connected, use the following line of code
    # admin = Admin.query.filter_by(Email=email).first()

    # This line of code simulates the admin's email address and password. 
    # It is used to test the function when there is no connection to the database. It will be deleted later
    mock_admin = {'Email': 'admin@example.com', 'Password': 'admin123'}

    '''
    # These codes are also used after connecting to the database
    if admin:
        # Directly compare the password in the database with the password sent from the front end
        if admin.Password == password:
            return jsonify({"message": "Login successful", "admin_id": admin.Admin_id}), 200
        else:
            return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "Admin not found"}), 404
    '''

    if email == mock_admin['Email']:
        if password == mock_admin['Password']:
            return jsonify({"message": "Login successful", "admin_id": 1}), 200
        else:
            return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "Invalid email"}), 404

# Simple password reset function, using json file to store user information
# In the future will change to database
USERS_FILE = 'users.json'
def read_users():
    try:
        with open(USERS_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def write_users(users):
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=2)
# Reset password API
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email') 
    new_password = data.get('newPassword')

    users = read_users()
    user = next((u for u in users if u['email'] == email), None) 

    if user:
        user['password'] = new_password 
        write_users(users)
        return jsonify({"message": "Password updated successfully"}), 200
    else:
        return jsonify({"message": "Reset failure"}), 404

if __name__ == '__main__':
    app.run(debug=True)

