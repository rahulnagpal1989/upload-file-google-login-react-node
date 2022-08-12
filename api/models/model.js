var moment = require('moment');
var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'aws'
  });
   
connection.connect();

function checkUserExist() {
    return new Promise((resolve,reject) => {
        connection.query("SELECT id from user where email_id='"+email_id+"'", function (error, results) {
            if (error) {
                return reject(error);
            }
            return resolve(results[0]);
        });
    });
}

function sleepQuery() {
    return new Promise((resolve,reject) => {
        connection.query("SELECT sleep(3)", function (error, results) {
            if (error) {
                return reject(error);
            }
            return resolve(results[0]);
        });
    });
}

function insertUser(full_name, email_id, email_verify) {
    var dt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    return new Promise((resolve, reject) => {
        connection.query("insert into user set full_name='"+full_name+"', email_id='"+email_id+"', email_verify='"+(email_verify?1:0)+"', created_at='"+dt+"', modified_at='"+dt+"', status='1'", function(error, result){
            if (error) {
                return reject(error);
            }
            return resolve(result.insertId);
        });
    });
}

function insertFile(user_id, filename) {
    var dt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    return new Promise((resolve, reject) => {
        connection.query("insert into user_files set user_id='"+user_id+"', file_name='"+filename+"', created_at='"+dt+"', modified_at='"+dt+"', status='1'", function(error, result){
            if (error) {
                return reject(error);
            }
            return resolve(result.insertId);
        });
    });
}

function getFiles(user_id) {
    return new Promise((resolve,reject) => {
        connection.query("SELECT id, 'files/' as folder, file_name, created_at from user_files where user_id='"+user_id+"' and status='1'", function (error, results) {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}

module.exports = {
    sleepQuery,
    checkUserExist,
    insertUser,
    insertFile,
    getFiles
 }