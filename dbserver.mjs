import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

//mongoose.connect('mongodb+srv://dbfahad:bharmal786@chatbotalcluster.mpfvc.mongodb.net/mychatapp?retryWrites=true&w=majority');
mongoose.connect('mongodb+srv://dbhuzaifa-1502:Youtube123@my-chatbot-ai.ivrp0.mongodb.net/My?retryWrites=true&w=majority', function () {
    console.log("db Connected");
});

// mongoose.connection.on('connected', function () {//connected
//     console.log("Mongoose is connected");
//     // process.exit(1);
// });

// mongoose.connection.on('disconnected', function () {//disconnected
//     console.log("Mongoose is disconnected");
//     process.exit(1);
// });

// mongoose.connection.on('error', function (err) {//any error
//     console.log('Mongoose connection error: ', err);
//     process.exit(1);
// });

// process.on('SIGINT', function () {/////this function will run jst before app is closing
//     console.log("app is terminating");
//     mongoose.connection.close(function () {
//         console.log('Mongoose default connection closed');
//         process.exit(0);
//     });
// });

const User = mongoose.model('users', {
    student_name: String,
    father_name: String,
    email: String,
    address: String,
    age: String,
    roll_no: String
});

const app = express();
const port = process.env.PORT || 4002;
app.use(cors());
app.use(express.json());
app.use(morgan('short'));

app.use((req, res, next) => {
    console.log("req come");
    next();
});

app.get('/users', (req, res) => {
    console.log("MYNAME")
    User.find({}, (err, users) => {
        console.log(err, users)
        if (!err) {
            res.send(users);
        } else {
            res.status(500).send("error");
        }
    })
})

app.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (!err) {
            res.send(user);
        } else {
            res.send(500).send("error")
        }
    })
})

app.post('/user', (req, res) => {
    if (!req.body.student_name || !req.body.father_name || !req.body.email || !req.body.address || !req.body.age || !req.body.roll_no) {
        res.status(400).send("invalid record");
    } else {
        const newUser = new User({
            student_name: req.body.student_name,
            father_name: req.body.father_name,
            email: req.body.email,
            address: req.body.address,
            age: req.body.age,
            roll_no: req.body.roll_no
        });
        newUser.save().then(() => {
            console.log("user created");
            res.send("user created");
        })
    }
})

app.put('/user/:id', (req, res) => {
    let updateUser = {};
    if (req.body.student_name) {
        updateUser.student_name = req.body.student_name;
    }
    if (req.body.father_name) {
        updateUser.father_name = req.body.father_name;
    }
    if (req.body.email) {
        updateUser.email = req.body.email;
    }
    if (req.body.address) {
        updateUser.address = req.body.address;
    }
    if (req.body.age) {
        updateUser.age = req.body.age;
    }
    if (req.body.roll_no) {
        updateUser.roll_no = req.body.roll_no;
    }
    User.findByIdAndUpdate(req.params.id, updateUser, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.status(500).send("error");
            }
        })
})

app.delete('/user/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            res.send("user deleted")
        } else {
            res.status(500).send("error happened")
        }
    })
})

app.use("/", (req, res) => {
    res.send("I'm Ubitian")
})

app.listen(port, () => {
    console.log("server is running");
})