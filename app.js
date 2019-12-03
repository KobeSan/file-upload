const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });
const fs = require('fs');
const port = 3000;

app.get('/monupload', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/monupload', upload.array('myfiles'), (req, res, next) => {
  const files = req.files;
  if (!files) {
    res.send('Please choose at least one file')
  } else if (files.map(file => file.size).reduce((a, b) => a + b, 0) > 3145728) {
    res.send('Please upload a file smaller than 3 Mo');
  } else {
    req.files.map(file => {
      fs.rename(file.path, `public/images/${file.originalname}`, (err) => {
        if (err) {
            res.send('Problem when upload');
            console.log(err);
        } else {
            res.send('File(s) upload with sucess');
        }
      });
    })
  }
})

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.log(`Server is listening on ${port}`);
});