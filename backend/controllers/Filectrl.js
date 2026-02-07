const express= require('express');
const pako = require('pako');
const fs = require('fs');

function dataCompression(data){
  const compressedData = pako.gzip(data);
  return Buffer.from(compressedData).toString('base64');
}

function decompressData(compressedBase64){
  const compressed = Buffer.from(compressedBase64, 'base64');
  const decompressed = pako.ungzip(compressed);
  return Buffer.from(decompressed);
}

function chunkData(data, chunkSize = 100000){
  const chunks=[];
  for(let i=0;i<data.length; i=i+chunkSize){
    chunks.push(data.substring(i,i+chunkSize));
  }
  return chunks;
}

function generateFileID(){
  return Date.now()+'-'+Math.random().toString(36).substring(7);
}

exports.uploadFile = (req,res,next)=>{
  try{
  const {fileName, fileType, fileSize, fileData} = req.body;
  const gun  = global.gun;
  const fileID = generateFileID();
  const compressedData = dataCompression(fileData);

  const chunks = chunkData(compressedData);
  const fileuploadTime = Date.now();

  const fileMetaData = 
  {
    fileId: fileID,
    fileName: fileName,
    fileType: fileType,
    fileSize: fileSize,
    originalLength : fileData.length,
    chunksCount: chunks.length,
    uploadedAt: fileuploadTime
  };
  
  gun.get('files').get(fileID).put({metadata:fileMetaData})


  for(let i =0;i<chunks.length;i++){
    gun.get('files').get(fileID).get(i.toString()).put({
      chunkData: chunks[i],
      index:i
    });
    if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
                console.log(`✅ Stored chunk ${i + 1}/${chunks.length}`);
            }
  }

  res.json({
    status:'success',
    fileMetaData: fileMetaData,
    fileID:fileID
  })
 }catch(error){
  console.log(error);
  res.json({status:'error', error:error});
 }

}

exports.getFile = (req,res,next)=>{
  try {
        const fileId = req.params.fileId;
        console.log(`📥 Downloading file: ${fileId}`);

        // Get metadata from Gun
        gun.get('files').get(fileId).once(async (metadata) => {
            if (!metadata || !metadata.fileId) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            console.log(`📊 File: ${metadata.fileName}`);
            console.log(`📦 Chunks: ${metadata.chunksCount}`);

            // Retrieve all chunks
            const chunks = [];
            let retrievedCount = 0;
            const timeout = setTimeout(() => {
                if (retrievedCount < metadata.chunksCount) {
                    res.status(500).json({
                        success: false,
                        message: 'Timeout retrieving file chunks'
                    });
                }
            }, 30000); // 30 second timeout

            for (let i = 0; i < metadata.chunksCount; i++) {
                gun.get('files').get(fileId).get('chunks').get(i.toString()).once((chunkData) => {
                    if (chunkData && chunkData.data) {
                        chunks[chunkData.index] = chunkData.data;
                        retrievedCount++;

                        if ((retrievedCount) % 10 === 0 || retrievedCount === metadata.chunksCount) {
                            console.log(`✅ Retrieved chunk ${retrievedCount}/${metadata.chunksCount}`);
                        }

                        // When all chunks retrieved
                        if (retrievedCount === metadata.chunksCount) {clearTimeout(timeout);
                            
                            try {
                                console.log(`🔗 Combining ${chunks.length} chunks...`);
                                
                                // Combine all chunks
                                const compressedData = chunks.join('');

                                console.log(`📤 Decompressing data...`);
                                
                                // Decompress
                                const decompressed = decompressData(compressedData);

                                console.log(`✅ File decompressed successfully`);
                                console.log(`📊 Decompressed length: ${decompressed.length}`);

                                // Send as JSON with base64 data
                                res.json({
                                    success: true,
                                    fileName: metadata.fileName,fileType: metadata.fileType,
                                    fileData: decompressed
                                });

                            } catch (error) {
                                console.error('❌ Decompression error:', error);
                                res.status(500).json({
                                    success: false,
                                    message: 'Decompression failed: ' + error.message
                                });
                            }
                        }
                    }
                });
            }
        });
      } catch (error) {
        console.error('❌ Download error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}