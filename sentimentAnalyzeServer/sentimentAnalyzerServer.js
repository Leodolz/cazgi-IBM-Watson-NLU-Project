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
    let callback = (error, resultData) => {
        if(error)
            res.status(500).send("Something went wrong!");
        res.send(JSON.stringify(resultData.emotion.document.emotion), null, 2);
    };
    analyzeNluMessage(null, req.query.url, 'emotion', callback);
});

app.get("/url/sentiment", (req,res) => {
    let callback = (error, resultData) => {
        if(error)
            res.status(500).send("Something went wrong!");
        res.send(JSON.stringify(resultData.sentiment.document));
    };
    analyzeNluMessage(null, req.query.url, 'sentiment', callback);
});

app.get("/text/emotion", (req,res) => {
    let callback = (error, resultData) => {
        if(error)
            res.status(500).send("Something went wrong!");
        res.send(JSON.stringify(resultData.emotion.document.emotion), null, 2);
    };
    analyzeNluMessage(req.query.text, null, 'emotion', callback);
});

app.get("/text/sentiment", (req,res) => {
    let callback = (error, resultData) => {
        if(error)
            res.status(500).send("Something went wrong!");
    res.send(JSON.stringify(resultData.sentiment.document));
    };
    analyzeNluMessage(req.query.text, null, 'sentiment', callback);
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

function analyzeNluMessage(text, url, type, callback)
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
        let result = analysisResults.result;
        callback(null, result);
  })
  .catch(err => {
      console.log('error: ', err);
      callback(err, null);
  });

}

