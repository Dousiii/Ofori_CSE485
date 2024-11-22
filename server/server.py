import random
import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import json
from flask_cors import CORS
from encryption import encrypt_data, decrypt_data
from flask import Flask, request, jsonify
from veri_server import send_verification_email
from bcrypt import hashpw, gensalt, checkpw


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
    return jsonify([{"Event_id":3,"Location":"De3mo","Title":"d3dd","Date":"cassacs"},{"Event_id":4,"Location":"D3emo","Title":"dd3d","Date":"cassacs"},{"Event_id":32,"Date":"cassacs","Location":"D3emo","Title":"dd3d"}])
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
    data = request.json
    email = data.get('email')
    password = data.get('password')  # User's plain text password
    admin = Admin.query.filter_by(Email=email).first()

    if admin:
        # Check hashed password
        if checkpw(password.encode(), admin.Password.encode()):
            return jsonify({"message": "Login successful", "admin_id": admin.Admin_id}), 200
        else:
            return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "Email not found"}), 404


# API: Reset password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('newPassword')  # User's plain text password

    # Hash the new password
    hashed_password = hashpw(new_password.encode(), gensalt())

    admin = Admin.query.filter_by(Email=email).first()
    if admin:
        admin.Password = hashed_password.decode()  # Save the hashed password
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
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

# Add new endpoint for creating events
@app.route('/createEvent', methods=['POST'])
def create_event():
    try:
        data = request.json
        new_event = Event(
            Title=data['title'],
            Date=data['date'],
            Location=data['location'],
            Total_audi=0  # Initialize with 0 audience
        )
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': {
                'Event_id': new_event.Event_id,
                'Title': new_event.Title,
                'Date': new_event.Date,
                'Location': new_event.Location,
                'Total_audi': new_event.Total_audi
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/deleteEvent/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        # First delete all associated audiences
        Audience.query.filter_by(Event_id=event_id).delete()
        
        # Then delete the event
        event = Event.query.get(event_id)
        if event:
            db.session.delete(event)
            db.session.commit()
            return jsonify({'message': 'Event deleted successfully'}), 200
        else:
            return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/updateEvent/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        data = request.json
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
            
        event.Title = data['title']
        event.Date = data['date']
        event.Location = data['location']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': {
                'Event_id': event.Event_id,
                'Title': event.Title,
                'Date': event.Date,
                'Location': event.Location,
                'Total_audi': event.Total_audi
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/addUserInfo', methods=['POST'])
def add_user_info():
    try:
        # Get data from POST request
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not (username and email and password):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the email already exists
        existing_admin = Admin.query.filter_by(Email=email).first()
        if existing_admin:
            return jsonify({"error": "An admin with this email already exists"}), 409

        # Hash the password
        hashed_password = hashpw(password.encode(), gensalt())

        # Create new Admin instance
        new_admin = Admin(
            Username=username,
            Email=email,
            Password=hashed_password.decode()  # Decode to string to store in DB
        )

        # Add to database
        db.session.add(new_admin)
        db.session.commit()

        return jsonify({
            "message": "Admin user created successfully",
            "Admin": {
                "Admin_id": new_admin.Admin_id,
                "Username": new_admin.Username,
                "Email": new_admin.Email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

