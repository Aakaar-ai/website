const axios = require('axios');
require('dotenv').config();

     exports.handler = async (event) => {
       if (event.httpMethod !== 'GET') {
         return {
           statusCode: 405,
           body: 'Method Not Allowed',
         };
       }

       const code = event.queryStringParameters.code;

       if (!code) {
         return {
           statusCode: 400,
           body: 'Authorization code is missing',
         };
       }

       try {
         const tokenResponse = await axios.post(
           'https://api.amazon.com/auth/o2/token',
           new URLSearchParams({
             grant_type: 'authorization_code',
             code: code,
             client_id: process.env.CLIENT_ID,
             client_secret: process.env.CLIENT_SECRET,
             redirect_uri: 'https://your-netlify-site.netlify.app/callback',
           }),
           {
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
             },
           }
         );

         const { access_token } = tokenResponse.data;

         const profileResponse = await axios.get('https://api.amazon.com/user/profile', {
           headers: {
             Authorization: `Bearer ${access_token}`,
           },
         });

         return {
           statusCode: 200,
           body: JSON.stringify(profileResponse.data),
         };
       } catch (error) {
         console.error(error.response?.data || error.message);
         return {
           statusCode: 500,
           body: 'Internal Server Error',
         };
       }
     };