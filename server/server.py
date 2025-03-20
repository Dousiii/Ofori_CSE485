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
import time


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
    Title = db.Column(db.String(100), nullable=False)
    Date = db.Column(db.Date, nullable=False)
    Time = db.Column(db.Time)
    Location = db.Column(db.String(100))
    Description = db.Column(db.Text)
    Video_url = db.Column(db.String(500))
    Total_audi = db.Column(db.Integer, default=0)

# Audience Table
class Audience(db.Model):
    __tablename__ = 'Audience'

    Audience_id = db.Column(db.Integer, primary_key=True)
    Event_id = db.Column(db.Integer, db.ForeignKey('Event.Event_id'), nullable=False)  # Foreign key referencing the Event table
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(200), nullable=False)
    Phone = db.Column(db.String(50), nullable=True)

#add ⬇︎
# Introduction Table
class Introduction(db.Model):
    __tablename__ = 'Introduction'

    Intro_id = db.Column(db.Integer, primary_key=True)
    Intro_text = db.Column(db.Text, nullable=False)
    Image_url = db.Column(db.String(500))

# Pop_up Table
class Pop_up(db.Model):
    __tablename__ = 'pop_up'

    Pop_id = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.String(255), nullable=False)
    Description = db.Column(db.Text, nullable=False)


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
        'Total_audi': event.Total_audi,
        'Description': event.Description,
        'Video_url': event.Video_url,
        'Time': str(event.Time) if event.Time else None  # Convert time to string
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

# Dictionary to store verification codes and expiration times
verification_data = {}
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
        code = '123456'
        expiry_time = time.time() + 60  #+300 (5 minutes)
        verification_data[email] = {"code": code, "expires_at": expiry_time}
        return jsonify({'message': 'Verification code sent (mock)', 'code': '123456', 'expires_at': expiry_time}), 200
    #
    #
    #
    #

    
    code = str(random.randint(100000, 999999))  #Get random 6 digits code for verification
    expiry_time = time.time() + 60  #+300 (5 minutes)
    verification_data[email] = {"code": code, "expires_at": expiry_time}
    status = send_verification_email(email, code)      #call the function in veri_server.py file

    if status == 202:  # 202 means the email was successfully accepted by SendGrid
        return jsonify({'message': 'Verification code sent', 'code': code, 'expires_at': expiry_time}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500

@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    email = data.get('email')
    user_code = data.get('code')

    if not email or not user_code:
        return jsonify({"error": "Email and code are required"}), 400

    stored_data = verification_data.get(email)

    if not stored_data:
        return jsonify({"error": "No code found. Request a new one."}), 400

    # Check if the code has expired
    if time.time() > stored_data["expires_at"]:
        return jsonify({"error": "Verification code expired. Request a new one."}), 400

    # Check if the code matches
    if stored_data["code"] == user_code:
        return jsonify({"message": "Verification successful"}), 200
    else:
        return jsonify({"error": "Invalid code"}), 400

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
        
        # Fetch the current highest Event ID
        highest_event = Event.query.order_by(Event.Event_id.desc()).first()
        next_event_id = highest_event.Event_id + 1 if highest_event else 1
        
        new_event = Event(
            Event_id=next_event_id,  # Assign the next available ID
            Title=data['title'],
            Date=data['date'],
            Location=data['location'],
            Total_audi=0,
            Description=data.get('description', ''),  # Default empty string if not provided
            Time=data.get('time'),
            Video_url=data.get('video_url', '')  # Only set Video_url once
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
                'Total_audi': new_event.Total_audi,
                'Description': new_event.Description,
                'Time': str(new_event.Time) if new_event.Time else None,
                'Video_url': new_event.Video_url
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
        event.Time = data.get('time')
        event.Description = data.get('description', '')
        event.Video_url = data.get('video_url', '')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': {
                'Event_id': event.Event_id,
                'Title': event.Title,
                'Date': event.Date,
                'Location': event.Location,
                'Total_audi': event.Total_audi,
                'Time': str(event.Time) if event.Time else None,
                'Description': event.Description,
                'Video_url': event.Video_url
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/addAudienceInfo', methods=['POST'])
def add_audience_info():
    try:
        # Get data from POST request
        data = request.json
        event_id = data.get('event_id')
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')

        if not (event_id and name and email):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the Event exists
        event = Event.query.filter_by(Event_id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Check if the email already exists for the given Event
        existing_audience = Audience.query.filter_by(Event_id=event_id, Email=email).first()

        # Create new Audience instance
        new_audience = Audience(
            Event_id=event_id,
            Name=name,
            Email=email,
            Phone=phone  # Optional field
        )

        # Add to database
        db.session.add(new_audience)
        db.session.commit()

        return jsonify({
            "message": "Audience member added successfully",
            "Audience": {
                "Audience_id": new_audience.Audience_id,
                "Event_id": new_audience.Event_id,
                "Name": new_audience.Name,
                "Email": new_audience.Email,
                "Phone": new_audience.Phone
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/getIntroduction', methods=['GET'])
def get_introduction():
    try:
        # Get the latest introduction
        intro = Introduction.query.order_by(Introduction.Intro_id.desc()).first()
        
        if intro:
            return jsonify({
                'intro_id': intro.Intro_id,
                'intro_text': intro.Intro_text,
                'image_url': intro.Image_url
            }), 200
        else:
            return jsonify({
                'intro_text': '',
                'image_url': ''
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/updateIntroduction', methods=['PUT'])
def update_introduction():
    try:
        data = request.json
        
        # Get the first introduction or create one if it doesn't exist
        intro = Introduction.query.first()
        if not intro:
            intro = Introduction(
                Intro_text=data['intro_text'],
                Image_url=data.get('image_url', '')
            )
            db.session.add(intro)
        else:
            intro.Intro_text = data['intro_text']
            intro.Image_url = data.get('image_url', '')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Introduction updated successfully',
            'intro_text': intro.Intro_text,
            'image_url': intro.Image_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Modify pop-up page function
@app.route('/getPopup', methods=['GET'])
def get_popup():
    popup = Pop_up.query.filter_by(Pop_id=1).first() 
    if popup:
        return jsonify({
            'title': popup.Title,
            'description': popup.Description
        }), 200 
    else:
        return jsonify({'error': 'Popup not found'}), 404 
    

@app.route('/updatePopup', methods=['PUT'])
def update_popup():
    try:
        data = request.json 
        popup = Pop_up.query.filter_by(Pop_id=1).first()
        
        if not popup:
            popup = Pop_up(Pop_id=1, Title=data['title'], Description=data['description'])
            db.session.add(popup) 
        else: 
            popup.Title = data['title']
            popup.Description = data['description']
        
        db.session.commit() 
        return jsonify({'message': 'Popup updated successfully'}), 200  
    except Exception as e:
        db.session.rollback() 
        return jsonify({'error': str(e)}), 500 
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)

