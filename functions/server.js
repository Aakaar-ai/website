const axios = require('axios');

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
             client_id: 'amzn1.application-oa2-client.763b2b90385546eaa671e9f8c4f1223a',
             client_secret: 'amzn1.oa2-cs.v1.9c5d73f62acdf4e7e613c9f8d4426a3ff712b2fcce80c108c0353b6297427826',
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