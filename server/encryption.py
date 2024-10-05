from cryptography.fernet import Fernet

# key = Fernet.generate_key()
key = b'm96v3EwkLaRXkUoUHEUEmaQD-mtxzgAyq6eIWpBelSk='  # Generated Key

# Creating a Fernet Object
cipher_suite = Fernet(key)

# Encryption Function
def encrypt_data(data):
    if isinstance(data, str):
        data = data.encode()
    encrypted_data = cipher_suite.encrypt(data)
    return encrypted_data

# Decryption function
def decrypt_data(encrypted_data):
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    return decrypted_data.decode()  # Decrypted and converted to a string

# Testing encryption and decryption
if __name__ == '__main__':
    text = "Hello, this is a test!"
    encrypted = encrypt_data(text)
    print("Encrypted:", encrypted)
    
    decrypted = decrypt_data(encrypted)
    print("Decrypted:", decrypted)