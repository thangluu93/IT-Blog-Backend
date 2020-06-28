const app = require('express')();
const http = require('http').createServer(app);
// const server = new (require('./index').creatNewServer)()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://itblog-a3e53.firebaseio.com"
});

const db = admin.firestore();
const documentRef = db.collection('posts');



http.listen(3000, () => {
    console.log(`Listening in 3000 `);
})

app.get('/', (req, res) => {
    res.send('Hello World')
});

//create post
app.post("/post", async (req, res) => {
    // console.log(req.body);
    try {
        await createPost(req.body);
        res.send({
            status: "create Done"
        });
    } catch (error) {
        res.send(error)
    }
});

function createPost(data) {
    documentRef.add(data);
    // console.log(data);
}

//delete post
app.post("/delete", async (req, res) => {
    try {
        await deletePost(req.body.id);
        res.send({
            status: "Delete done"
        })
    } catch (error) {
        res.send(error)
    }
});

function deletePost(id) {
    documentRef.doc(id).delete();
}

//update post  
app.post("/update", async (req, res) => {
    try {
        await updatePost(req.body.id, req.body.formData);
        res.send({
            status: "Update done"
        })
    } catch (error) {
        res.send(error);
    }
})

function updatePost(id, formData) {
    documentRef.doc(id).update(formData);
}
