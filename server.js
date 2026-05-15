```javascript
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const webhook =
'https://n8n-production-a9be2.up.railway.app/webhook/bde39fec-3dc5-48bd-95d3-9b7402ae703b';

app.post('/chat', async (req,res)=>{

  try{

    const response = await fetch(webhook,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        message:req.body.message
      })
    });

    const data = await response.json();

    res.json(data);

  } catch(error){

    res.status(500).json({
      error:'Webhook failed'
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log('Server running');
});
```
