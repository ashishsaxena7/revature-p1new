require('dotenv').config()
const express = require('express')
const fileUpload = require('express-fileupload')
const multer = require('multer')
const upload = multer({ dest: './upload/'})
const path = require('path')
const fs = require('fs')
let directorypath = path.join(__dirname, '/upload/')
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential,
  uploadStreamToBlockBlob
} = require('@azure/storage-blob');

const cosmos = require('@azure/cosmos')
const CosmosClient = cosmos.CosmosClient
const app = express();
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;
let port = 8080;
app.use(express.static('.'))
//app.use(fileUpload());


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})


const sharedKeyCredential = new SharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);
const containerName = process.env.CONTAINER;
const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);


const nosql = new CosmosClient({ endpoint: process.env.DATABASE_URI, auth: {
  masterKey: process.env.DATABASE_KEY
}})
nosql.database('testing123').container('testplease2').items.readAll().toArray().then(res => console.log(res.result))

app.get('/images', (req,res) =>{
  if (process.env.CONTAINER && process.env.CONTAINER_ID == false){
    return smuk = false
  }
  containerURL.listBlobFlatSegment(Aborter.none)

  .then(listBlobsResponse => {

    res.json(listBlobsResponse.segment.blobItems.map(item => {

      return `${containerURL.storageClientContext.url}/${item.name}`;

    }));

  });
})


app.listen(port, function(){
  console.log('server is up');
});


app.post('/upload', uploadStrategy, async (req, res) => {
//app.post('/upload', upload.single('sampleFile'), (req,res)=>{
  // if (req.files.length == 0) {
  //   return res.status(400).send('No files were uploaded.');
  //  }
  // let filename = req.files.sampleFile.name
  // let File = req.files.sampleFile;
  // File.mv(directorypath + filename, function(err) {
  //   if (err)
  //     return res.status(500).send(err);
  //  });


  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  const blobName = Math.random().toString().replace(/0\./, '') + req.file.originalname; 
  const stream = getStream(req.file.buffer);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

    await uploadStreamToBlockBlob(aborter, stream,
      blockBlobURL, uploadOptions.bufferSize, uploadOptions.maxBuffers); 

  const documentDefinition = { id: blobName, content: req.file.buffer }
  
  //const body = await nosql.container.items.create(documentDefinition);
  // console.log("Created item with content: ", body.content)

//  const item  = await nosql.database(process.env.DATABASE_ID).container(process.env.CONTAINER_ID).items.create(documentDefinition);
  // const dbID=process.env.DATABASE_ID
  // const containerID=process.env.CONTAINER_ID
  // console.log(dbID)
  // console.log(containerID)
  // nosql.database(dbID).container(containerID).items.readAll().toArrary().then(res => console.log(res.result))
   res.redirect('/')
    });


