// db.config.js
// 建立mysql連線
module.exports = {
    host: 'localhost',// 伺服器地址
    user: 'blockchainuser',// mysql使用者名稱
    password: 'Passw0rd',// mysql使用者密碼
    port: '3306',// 埠
    database: 'blockchain',// 資料庫名稱
}

// db.js
var mysql = require('mysql2')
var dbConfig = require('./db.config')


function query(sql, params, callback) {

    //每次使用的時候需要建立連結，資料操作完成之後要關閉連線
    var connection = mysql.createConnection(dbConfig)
    connection.connect(function (err) {
        if (err) {
            throw err
        }
        //開始資料操作
        connection.query(sql, params, function (err, results, fields) {
            if (err) {
                throw err
            }
            //將查詢出來的資料返回給回撥函式
            callback &&
                callback(
                    JSON.parse(JSON.stringify(results)), JSON.parse(JSON.stringify(fields))
                )
            //停止連結資料庫，必須在查詢語句後，要不然一呼叫這個方法，就直接停止連結，資料操作就會失敗
            connection.end(function (err) {
                if (err) {
                    console.log('關閉資料庫連線失敗！')
                    throw err
                }
            })
        })
    })
}


function updated(sql, params, callback) {
    var connection = mysql.createConnection(dbConfig);
    connection.connect(function (err) {
        if (err) {
            throw err
        }
        connection.execute(sql, params, function (err, results, fields) {
            if (err) {
                throw err
            }
            //將查詢出來的資料返回給回撥函式
            callback && callback(true)

        });
    });
}

module.exports = {

    select1155: function (params, callback) {
        let sql = "";
        if (params.length != 0) {
            sql = 'SELECT * from `erc1155`';
        } else {
            sql = 'SELECT * from `erc1155`';
        }
        console.log(sql + ":" + params);

        query(sql, params, callback);
    },

    select721: function (params, callback) {


        let sql = 'SELECT * from `erc721`';

        query(sql, params, callback);
    },

    insert1155: function (params, callback) {
        let sql = 'INSERT INTO `erc1155` values (?,?,?,?)';
        updated(sql, params, callback);
    },

    insert721: function (params, callback) {
        let sql = 'INSERT INTO `erc721` values (?,?,?,?,?,?)';
        console.log("db");
        updated(sql, params, callback);
    },

    // update: function (params, callback) {
    //     let ENAME = "周鬼鬼";
    //     let sql = 'UPDATE `DB_DEMO` SET `CName` = ?, `EName` = ? WHERE `id` = ?';
    //     updated(sql, params, callback);
    // },

    // delete: function (params, callback) {
    //     let sql = 'DELETE from `DB_DEMO` where `id` = ?';
    //     updated(sql, params, callback);
    // },

    // checkAccount: function (params, callback) {
    //     let sql = "SELECT * from `DB_HR` WHERE `HR_Account` = ? and `HR_Password` = ?";
    //     query(sql, params, callback);
    // },
}



