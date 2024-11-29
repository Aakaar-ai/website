exports.handler = async () => {
    return {
      statusCode: 200,
      body: JSON.stringify({ clientId: process.env.CLIENT_ID }), // Securely provide the client ID
    };
  };