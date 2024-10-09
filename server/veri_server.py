from flask import Flask, jsonify, request
import sendgrid
from sendgrid.helpers.mail import Mail
import os
import random
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from the .env file
load_dotenv()

# Set your SendGrid API Key (use environment variable for security)
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

# Debugging: Print the SendGrid API Key
print("SendGrid API Key:", SENDGRID_API_KEY)  # Check if the API key is set correctly

# Function to send verification email
def send_verification_email(to_email, code):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    message = Mail(
        from_email='oforiverificationcode@outlook.com', 
        to_emails=to_email,
        subject='Your Verification Code',
        plain_text_content=f'Your one-time verification code is: {code}'
    )
    try:
        response = sg.send(message)
        print("Response Status Code:", response.status_code)  # Log status code
        return response.status_code
    except Exception as e:
        print("Error sending email:", str(e))
        return None


# Endpoint to send verification code
@app.route('/send-verification-code', methods=['POST'])
def send_verification_code():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    code = str(random.randint(100000, 999999))  #Get random 6 digits code for verification
    status = send_verification_email(email, code)

    if status == 202:  # 202 means the email was successfully accepted by SendGrid
        return jsonify({'message': 'Verification code sent', 'code': code}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500


if __name__ == '__main__':
    app.run(debug=True)
