// Entry Point of the API Server 
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.GPT_KEY,
});

const openai = new OpenAIApi(configuration);
  
/* Creates an Express application. 
   The express() function is a top-level 
   function exported by the express module.
*/
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({origin:true,credentials: true}));

app.use(express.json());

app.post('/rewrite', async (req, res) => {
    let inputText = req.body.inputText || '';

    if (inputText === '') {
        res.json({ status: 'ERROR', text: '', error: 'Empty request' });
        return;
    }

    await openai.createCompletion({
        model: "text-davinci-003",
        prompt: inputText,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      })
      .then((openAiResponse) => { 
        console.log(' the response ' + openAiResponse.data);
        res.json({ status: 'SUCCESS', text: openAiResponse.data /*response.data.choices.at(0).text || '' */, error: ''});
        return;
      })
      .catch((err) => { 
        res.json({ status: 'ERROR', text: '', error: err + ' '});
        return;
     });
});
  
// Require the Routes API  
// Create a Server and run it on the port 3000
app.listen(PORT, () => console.log('Server in running now'));