const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
var formidable = require('formidable');
var fs = require('fs');
var {checkUserExist, insertUser, insertFile, getFiles} = require('../models/model');

exports.homePage = (req, res, next) => {
    res.send('Hello World!');
};

exports.dashboardPage = async (req, res, next) => {
    //await sleepQuery();
    res.send("Dashboard page...");
};

exports.loginRequired = (req, res, next) => {
    // https://www.youtube.com/watch?v=qY0PZ-z61EQ&list=PLu0W_9lII9agx66oZnT6IyhcMIbUMNMdt&index=51
    const token = req.headers['token'];
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, jwtSecretKey);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    next();
};

exports.uploadFile = (req, res, next) => {
    const token = req.headers['token'];
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);
    userId = decoded.user_id;

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.myfile.filepath;
        var newpath = 'files/' + files.myfile.originalFilename;
        fs.rename(oldpath, newpath, async function (err) {
            if (err) throw err;
            file_id = await insertFile(userId, files.myfile.originalFilename);
            res.json({
                success: 1,
                message: 'File uploaded successfully'
            });
        });
    });
};

exports.getFiles = async (req, res, next) => {
    const token = req.headers['token'];
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);
    userId = decoded.user_id;

    let results = await getFiles(userId);
    res.json({
        success: 1,
        message: 'Files list',
        result: results
    });
};

exports.validateToken = (req, res, next) => {
    const token = req.headers['token'];
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, jwtSecretKey);
        diff = (new Date().getTime() - new Date(decoded.time).getTime())/1000
        if(diff > parseInt(process.env.TOKEN_EXPIRE)/2 && diff < process.env.TOKEN_EXPIRE) {
            let userId = decoded.user_id;
            let data = {
                time: Date(),
                user_id: userId,
            }
            const token = jwt.sign(data, jwtSecretKey, {
                expiresIn: process.env.TOKEN_EXPIRE //86400=expires in 24 hours
            });
            // expiresIn: "10h" // it will be expired after 10 hours
            //expiresIn: "20d" // it will be expired after 20 days
            //expiresIn: 120 // it will be expired after 120ms
            //expiresIn: "120s" // it will be expired after 120s
            return res.json({
                access_token: token,
                status: 1,
                refreshRequired: true,
                tokenExpired: false,
                message: 'Token will be expired soon and sending new one'
            });
        } else {
            res.json({
                success: 1,
                refreshRequired: false,
                tokenExpired: false,
                message: 'Token is valid'
            });
        }
    } catch (err) {
        if(err == 'TokenExpiredError: jwt expired') {
            res.json({
                status: 1,
                refreshRequired: false,
                tokenExpired: true,
                message: 'Token has been expired'
            });
        } else {
            return res.status(401).send("Invalid Token");
        }
    }
};

exports.signupPage = async (req, res) => {
    full_name = req.body.full_name;
    email_id = req.body.email_id;
    email_verify = req.body.email_verify;
    
    var userId = 0;
    try {
        var user_exists = await checkUserExist(email_id);
        if(user_exists && user_exists.id>0) {
            userId = user_exists.id;
        } else {
            userId = await insertUser(full_name, email_id, email_verify);
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            user_id: userId,
        }
        const token = jwt.sign(data, jwtSecretKey, {
            expiresIn: process.env.TOKEN_EXPIRE //86400=expires in 24 hours
        });
        
        res.json({
            success: 1,
            message: "Success",
            user_id: userId,
            access_token: token
        });
    } catch(e) {
        res.json({
            success: 0,
            message: "Error",
            error: e
        });
    }
}
