import random
import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import json
from flask_cors import CORS
from encryption import encrypt_data, decrypt_data
from flask import Flask, request, jsonify
from veri_server import send_verification_email


app = Flask(__name__)
CORS(app)

##MySql setting     ⬇︎⬇︎⬇︎⬇︎

# MySQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Ofori%401324@146.190.71.187:3306/ofori'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

#Initial the Table in DataBase  ⬇︎⬇︎⬇︎⬇︎

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


#Initial some get all function to check it connection   ⬇︎⬇︎⬇︎⬇︎

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
    audiences = Audience.query.all()  #get all audience in table
    return jsonify([{
        'Audience_id': audience.Audience_id,
        'Name': audience.Name,
        'Email': audience.Email,
        'Event_id': audience.Event_id,
        'Phone': audience.Phone
    } for audience in audiences])


#

#       MySql setting done   ⬆︎⬆︎⬆︎⬆︎

    
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

# API: Admin login
@app.route('/admin_login', methods=['POST'])
def admin_login():
    data = request.json  # Get email and password
    email = data.get('email')
    password = data.get('password')
    # Verify email address using database query
    admin = Admin.query.filter_by(Email=email).first()
    if admin:
        if admin.Password == password:
            return jsonify({"message": "Login successful", "admin_id": admin.Admin_id}), 200
        else:
            return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "Email not found"}), 404


#      Verification page function   ⬇︎⬇︎⬇︎⬇︎

#

# Function to get admin email
@app.route('/get_admin_email/<int:admin_id>', methods=['GET'])
def get_admin_email_api(admin_id):
    admin = db.session.get(Admin, admin_id)
    if admin:
        return jsonify({'email': admin.Email}), 200
    else:
        return jsonify({'error': 'Admin not found'}), 404


# Endpoint to send verification code
@app.route('/send-verification-code', methods=['POST'])
def send_verification_code():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        

    #Use for when API key is not set and use for testing, will delete in the future
    #
    #
    #
    sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
    # Check if the API key is set
    if not sendgrid_api_key:
        # If there's no API key, return a mock code for development
        return jsonify({'message': 'Verification code sent (mock)', 'code': '123456'}), 200
    #
    #
    #
    #


    code = str(random.randint(100000, 999999))  #Get random 6 digits code for verification
    status = send_verification_email(email, code)      #call the function in veri_server.py file

    if status == 202:  # 202 means the email was successfully accepted by SendGrid
        return jsonify({'message': 'Verification code sent', 'code': code}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500


@app.route('/get_admin_id', methods=['POST'])
def get_admin_id():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    admin = Admin.query.filter_by(Email=email).first()
    if admin:
        return jsonify({"admin_id": admin.Admin_id}), 200
    else:
        return jsonify({"error": "Admin not found"}), 404


@app.route('/check_email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')
    # Check if the email exists
    user = Admin.query.filter_by(Email=email).first()
    if user:
        return jsonify({"exists": True}), 200
    else:
        return jsonify({"exists": False, "message": "Email does not exist"}), 404


#

#       Verifivation page function   ⬆︎⬆︎⬆︎⬆︎


# API reset password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')  # Get the email
    new_password = data.get('newPassword')  # Get new password
    # Search admin info
    admin = Admin.query.filter_by(Email=email).first()
    if admin:
        # Reset password
        admin.Password = new_password
        db.session.commit()  # Submit changes to the database
        return jsonify({"message": "Password updated successfully"}), 200
    else:
        return jsonify({"message": "Email not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)

