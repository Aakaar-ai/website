require('dotenv').config();

exports.handler = async () => {
    console.log(process.env.CLIENT_ID)
    return {
      statusCode: 200,
      body: JSON.stringify({ clientId: process.env.CLIENT_ID }), // Securely provide the client ID
    };
  };