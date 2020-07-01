const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Helloooo world");
});

exports.getScreams = functions.https.onRequest(async (req, res) => {
    const data = await admin.firestore().collection('screams').get()

    let screams = []
    data.forEach(scream => {
        screams.push(scream.data())
    })

    // admin.firestore().collection('screams').get()
    // .then(data => {
    //     let screams = []
    //     data.forEach(doc => {
    //         screams.push(doc.data())
    //     })

    //     return res.json(screams)
    // }).catch(err => console.error(err))

    res.json(screams)
})

exports.createScream = functions.https.onRequest(async (req, res) => {

    if(req.method !== 'POST'){
        return res.status(400).json({error: 'Method not allowed'})
    }

    try {
        const newScream = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createdAt: admin.firestore.Timestamp.fromDate(new Date())
        }
    
        const docRef = await admin.firestore()
            .collection('screams')
            .add(newScream)

        res.json({message: `document ${docRef.doc.id} created successfully`})

    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'something went wrong'})
    }

})