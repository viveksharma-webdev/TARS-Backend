const multer = require('multer');
const storage = multer.memoryStorage();
const path = require('path');
const filter = (req,file,cb)=>{
  const extname = ['.png', '.jpeg','.jpg', '.webp'] ;
  let ext = path.extname(file.originalname);

  let includedOrNot = extname.includes(ext);

  cb(null, includedOrNot);
}


const upload = multer({storage: storage, filter: filter, limits: {
    fileSize: 10* 1024*1024
}});

module.exports = upload;

