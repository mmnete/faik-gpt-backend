// Entry Point of the API Server 
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.GPT_KEY,
});

const openai = new OpenAIApi(configuration);

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
        temperature: 0.7,
        max_tokens: 2901,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((openAiResponse) => {
        res.json({ status: 'SUCCESS', text: openAiResponse.data.choices[0].text, error: ''});
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