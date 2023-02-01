const express = require('express');

const sa = require('../helpers/scraper')

const app = express();

app.use(express.json());

app.post('/process-url', (req, res) => {
  const { url } = req.body;
  if(url.match("/([a-zA-Z0-9]{10})(?:[/?]|$)")){
    console.log(url)
    results = sa.sentimentAnalysis(url).then(results => {
    console.log(results);
    res.json(results)
  })
  }
  else{res.status(400).send()}
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
