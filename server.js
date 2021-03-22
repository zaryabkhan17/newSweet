const PORT = process.env.PORT || 5000;
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');
var http = require("http");
var path = require('path')
const admin = require("firebase-admin");
const fs = require('fs')
const multer = require('multer')
var { userModel, productmodel } = require("./dbrepo/models");

var { SERVER_SECRET } = require("./core/index");

var authRoutes = require("./routes/auth");

var app = express();

var server = http.createServer(app);



app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('dev'));


app.use("/", express.static(path.resolve(path.join(__dirname, "front-end/build"))))

app.use('/auth', authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 84600,000

            if (diff > 300000) { // expire after 5 min (in milis)
                res.send({
                    message: "TOKEN EXPIRED",
                    status: 401
                });
            } else { // issue new Token
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    phone: decodedData.phone,
                    role: decodedData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.send({
                message: "Invalid Token",
                status: 401
            });
        }


    });

});

app.get("/profile", (req, res, next) => {
    console.log(req.body);

    userModel.findById(req.body.jToken.id, 'name email phone createdOn role', function (err, doc) {
        if (!err) {
            res.send({
                status: 200,
                profile: doc
            })

        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
})

const storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })




var SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": "sweetshop-e151a",
    "private_key_id": "8600d5546d20cccacb06bcaaede55d5e4b2040f2",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDuZ+yQvQe4Rq5S\nfXow0OiCKV2RI6CjLIN/M+7PAykP5jjWWW6BTnaj2HS3rl5INWuQ4VkzTH1dg/f3\n3QlpIM1Vka7OZDnx4WZe4AN7lsE1XMujhS4XC7sDvfXlTCFLqT3dWTAs9wogLG8b\nDgOHUo4Y9xcEQERyTNdtYPTypVx6D32BAl/IUBUFkaMaY7Iz5fwJwV5nCN2uQsTJ\nz4U8gNucjEGgWdNkBuS/RQkHFmuWKBodLNbnLDu/n1er/rCwBqPNDIkhdpNQx3m2\nAnRsx3OoC+a7g3iVFsO8wA7uxp0P8EtmDZ5JVHC0YxaiHjbYYwOr6IQQsE+04+fe\nkK3OMSs7AgMBAAECggEAHU1KpzOEmmKdlGf1t8BFg5H//RHK8aNL+jtw06LIzjp2\nq+nMCjqRnGvDVLwqvGdMdD8uTn7NPcw1kxJo0LIGaskAGj/5W0Bf67NO2kbaMmvY\nX53D33NCpiAX8/nacck4YFdQ84XdibzMXx/m0SAVdP4RpyUbBI1rQPdUw+oNJrc5\n80W0085Ej+F91iCG3xtdKmVYvwbUDQYObdAbWTf+LETkC+L09sA236tfDmQE+XOR\n0KCQdeKCOr4lBRJlUg314XLibn7E5eAvSc+hcCkkM5bIduWgjpp6uftavaM6kzQw\nhHJ5i7D/Hmh1F3N8IHh4HuQiwMhazg3taKYlZUItQQKBgQD5vA/Df1tNdcxUyvqe\n9bkj0ZiMhKwhH/JfMV0wFwKdGASRhOryYYHEjYaUX6bsfQVMKCGZOdhP0vr4odF0\ncK7nAI64q9RsMWvd6utv8eZTiXmwvMcK/b0pz2TmtUOi/lJ0H8SPpgnuaQ9W9tkt\n9T9YT8bqkWw0KI+8uAzAa61umwKBgQD0Yxp2GWBRAwpgR2PUzcnOBm/Y1R91l6+p\n1aQIo1ZITE54n60EO6hR31vIZ+bjUnPWwSH2P+/WhwZUUo/PIJG9pNXqmoZ9jDT1\nAQ628JRktmRRFUQnB2kRgZ09XA8gYjCuKSx8X8UYo8G6hfi9oU0HtJpRKj9CFgvq\nG3AP+2Wv4QKBgQDUVmWk2OWdv/ojYo6jl9R6Mx0c5TWh2JLxA3zzha0QOzqvLC/E\nNMnsgFUcVRQN4eMeNMUUjk1w2bfQrW31LlZYTW4McPVlpMPNZZAXl7s57hsM/gXT\nP5mWMiPd0eOXc9xRpi0v4oJxNtz3GV3hqLPad8Ju8YTp+E72rBsThLpq3wKBgEXN\nlL5Myzz4cFtFqNccnFqTbhjx7tVoqQ0Kb5rkBH4MBZHgkcuWuqH/+ThJrSIa5+lc\nKrYqVvfgg0dMebUAqYAQd+VVk7qCdJHSZoCMQOZvTkH2oAvByxnr+pyPEeb/BMaK\nDiHMPQCnrWr4Xy7Sxqy/wiASwBTBNU/93ElEViwhAoGAMVRFuWWC4x2PSvWbEWBW\n80k1YQrornMm3anCmwMCI2YIU7LIQzEZ4qLiZ5kOdI6LF0dPiq3+evscqfpansIv\nUzho7WNcx7QczXM6OTsBC5e7pZIXnGPYgDW6mXKYWIK86y/44rjjDLGm3wSzaZK4\nnBel/titwQ3Bg9KBeABiHu0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qhs1y@sweetshop-e151a.iam.gserviceaccount.com",
    "client_id": "100830662941033787188",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qhs1y%40sweetshop-e151a.iam.gserviceaccount.com"
  }







admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    DATABASE_URL: "https://sweetshop-e151a-default-rtdb.firebaseio.com/"
});



const bucket = admin.storage().bucket("gs://sweetshop-e151a.appspot.com");

//==============================================

app.post("/admindashboard", upload.any(), (req, res, next) => {

    bucket.upload(
        req.files[0].path,

        function (err, file, apiResponse) {
            if (!err) {
                console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {

                    if (!err) {
                        // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        console.log(req.body.avalablity)
                        console.log("headerskdflasfjks ka data  ===================>>>>> ", req.headers.jToken.id)
                        console.log("headerskdflasfjks request headers  ===================>>>>> ", req.headers)
                        userModel.findById(req.headers.jToken.id, 'email role', (err, users) => {
                            console.log("Adminperson ====> ", users.email)

                            if (!err) {
                                productmodel.create({
                                    "title": req.body.title,
                                    "price": req.body.price,
                                    "availability": req.body.avalablity,
                                    "cartimage": urlData[0],
                                    "description": req.body.description
                                })
                                    .then((data) => {
                                        console.log(data)
                                        res.send({
                                            status: 200,
                                            message: "Product add successfully",
                                            data: data
                                        })

                                    }).catch(() => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: "Not added, " + err
                                        })
                                    })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})




server.listen(PORT, () => {
    console.log("Server is Running:", PORT);
});