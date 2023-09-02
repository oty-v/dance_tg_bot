const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./../config/firebase.js');
const { convertToWebP } = require('./FileController');
const storageUrl = process.env.FIREBASE_STORAGE;
console.log(serviceAccount());
initializeApp({
  credential: cert(serviceAccount()),
  storageBucket: storageUrl
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function uploadFileFromURL(url, destinationPath, filename) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const fileData = Buffer.from(response.data, 'binary');

        const tempFilePath = path.join('/tmp', `${filename}.jpg`);

        fs.writeFileSync(tempFilePath, fileData);
        const filePath = `/tmp/${filename}.webp`;
        await convertToWebP(tempFilePath, filePath);

        await bucket.upload(filePath, {
            destination: `${destinationPath}/${filename}.webp`,
            metadata: {
                contentType: 'image/webp',
                metadata: {
                    firebaseStorageDownloadTokens: null
                }
            }
        });
        const filenamePublicUrl = destinationPath !== '' ? `${destinationPath}%2F${filename}` :  `${filename}`;
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/test-79717.appspot.com/o/${filenamePublicUrl}.webp?alt=media`;

        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

const deleteFile = async (destinationPath, filename) => {
    try {
        const file = filename ? `${destinationPath}/${filename}.webp` : `${destinationPath}.webp`;
        await bucket.file(file).delete();
        if (!filename) {
            const options = {
                prefix: destinationPath
            };
            await bucket.deleteFiles(options);
        }
        return true;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw false;
    }
}


const getContent = async (docRef) => {
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log("No Doc");
        return null;
    } else {
        return doc.data();
    }
}

const getIdAndKey = async (docName, name) => {
    const res = await getContent(db.collection("ru").doc(docName.toString()));
    if (res) {
        const index = res.cards.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
        return {id: res.cards[index].document_id, key: index, content: res};
    } 
    return null;
}

const getPageContent = async (docName, lang) => {
    if(lang){
        return await getContent(db.collection(lang.toString()).doc(docName.toString()))
    }
    const res = {};
    res["ru"] = await getContent(db.collection("ru").doc(docName.toString()))
    res["ua"] = await getContent(db.collection("ua").doc(docName.toString()))
    return res;
}

const getSubPageContent = async (doc, id, lang) => {
    if(lang){
        return await getContent(db.collection(lang.toString()).doc(doc.toString()).collection('list').doc(id.toString()))
    }
    const res = {};
    res["ru"] = await getContent(db.collection("ru").doc(doc.toString()).collection('list').doc(id.toString()))
    res["ua"] = await getContent(db.collection("ua").doc(doc.toString()).collection('list').doc(id.toString()))
    return res;
}

const setData = async (lang, doc, data) => {
    return await db.collection(lang.toString()).doc(doc.toString()).set(data, { merge: true });
}

const setDataSubCollection = async (lang, doc, id, data) => {
    return await db.collection(lang.toString()).doc(doc.toString()).collection('list').doc(id.toString()).set(data, { merge: true });
}

const deleteDataSubCollection = async (lang, doc, id) => {
    return await db.collection(lang.toString()).doc(doc.toString()).collection('list').doc(id.toString()).delete();
}

module.exports = {
    uploadFileFromURL,
    deleteFile,
    getPageContent,
    getSubPageContent,
    setData,
    getIdAndKey,
    setDataSubCollection,
    deleteDataSubCollection
}