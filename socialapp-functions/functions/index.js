const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express')
const app = express()


app.get('/screams', async (req,res)=>{
    
    const data = await admin.firestore()
                            .collection('screams')
                            .orderBy('createdAt', 'desc')
                            .get()

    let screams = []
    data.forEach(scream => {
        screams.push({
            screamId: scream.id,
            body: scream.data().body,
            userHandle: scream.data().userHandle,
            createdAt: scream.data().createdAt
        })
    })
    
    res.json(screams)
})


app.post('/scream', async (req, res) => {

    try {
        const newScream = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createdAt: new Date().toISOString()
        }
    
        const docRef = await admin.firestore()
            .collection('screams')
            .add(newScream)

        res.json({message: `document created successfully`})

    } catch (err) {
        console.error(err)
        res.status(500).json({error: `something went wrong: ${err}`})
    }

})

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app)