const express = require('express');
const app = new express();
require('dotenv').config();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    
    analyzeNluMessage(null, req.query.url, 'emotion', res);
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    analyzeNluMessage(req.query.text, null, 'emotion', res);
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });

    return naturalLanguageUnderstanding;
}

const analyzeNluMessage = (text, url, type, res) =>
{
    let nluInstance = getNLUInstance();
    let analyzeParams = {features: {}};
    analyzeParams.features[type] = {};
    if(text === null)
    {
        analyzeParams.url = url;
    }
    else 
    {
        analyzeParams.text = text;
    }
    nluInstance.analyze(analyzeParams)
    .then(analysisResults => {
        let result = JSON.stringify(analysisResults.result,null,2);
        console.log(result);
        res.end(result);
  })
  .catch(err => {
      console.log('error: ', err);
      res.end(JSON.stringify(
          {
              error: err.code,
              message: err.message
          }
      ));
  });

}

