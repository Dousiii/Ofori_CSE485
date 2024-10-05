import React, { useState } from 'react';

const EncryptionTest = () => {
  const [email, setEmail] = useState('');  // Text to encrypt
  const [encryptedEmail, setEncryptedEmail] = useState('');  // The encrypted result
  const [decryptedEmail, setDecryptedEmail] = useState('');  // The result after decryption

  // Handling cryptographic operations
  const handleEncrypt = async () => {
    try {
      const response = await fetch('http://localhost:5000/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: email }),  // Send the user input data to the backend for encryption
      });
      const result = await response.json();
      setEncryptedEmail(result.encrypted_data);  // Display encrypted data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handling decryption operations
  const handleDecrypt = async () => {
    try {
      const response = await fetch('http://localhost:5000/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encrypted_data: encryptedEmail }),  // Send encrypted data to the backend for decryption
      });
      const result = await response.json();
      setDecryptedEmail(result.decrypted_data);  // Display the decrypted data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Encryption and Decryption Test</h1>
      <input
        type="text"
        placeholder="Enter text to encrypt"
        value={email}
        onChange={(e) => setEmail(e.target.value)}  // Listen to user input and update the content to be encrypted
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <p>Encrypted Email: {encryptedEmail}</p>

      <input
        type="text"
        placeholder="Enter encrypted text to decrypt"
        value={encryptedEmail}
        onChange={(e) => setEncryptedEmail(e.target.value)}  // Update the encrypted text to be decrypted
      />
      <button onClick={handleDecrypt}>Decrypt</button>
      <p>Decrypted Email: {decryptedEmail}</p>
    </div>
  );
};

export default EncryptionTest;

