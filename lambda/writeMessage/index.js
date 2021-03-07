const mysql = require('mysql');
const sdk = require('aws-sdk');

exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const body = JSON.parse(event.body);
    const userid = body.data.userid; // client: null, admin: put target clientID
    const roomid = body.data.roomid; // roomid
    const message = body.data.message; // message
    
    const conn = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    const man = new sdk.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        region: "ap-northeast-2",
        accessKeyId: process.env.awsaccessKeyId,
        secretAccessKey: process.env.awssecretkey,
        endpoint: process.env.endpoint
    });
    
    const prom = new Promise((res, rej) => {
        conn.query(`SELECT isadmin, userid FROM chat_user WHERE connectionId='${connectionId}'`, (err, data) => {
            console.log(connectionId, data);
            if(!err) {
                if(data[0].isadmin) {
                    man.postToConnection({
                        ConnectionId: userid,
                        Data: JSON.stringify({action: "message", message: message})
                    }, (err) => {
                        if(err) {
                            if(err.statusCode === 410) {
                                conn.query(`DELETE FROM chat_user WHERE connectionId='${userid}'`, () => {res()});
                            }
                            else {
                                console.log(err);
                                res();
                            }
                        }
                        else {
                            conn.query(`INSERT INTO chat_message (userid, roomid, msg) VALUES ('${data[0].userid}', '${roomid}', '${message}')`, (err) => {
                                res();
                            });
                        }
                    });
                }
                else {
                    conn.query(`SELECT connectionId FROM chat_user WHERE roomid='${roomid}' and isadmin=true`, async (err, ans) => {
                        console.log(err, ans, roomid);
                        for(var it of ans) {
                            const ant = new Promise((res, rej) => man.postToConnection({
                                ConnectionId: it.connectionId,
                                Data: JSON.stringify({action: "message", message: message, userid: connectionId})
                            }, (err) => {
                                if(err) {
                                    if(err.statusCode === 410) {
                                        conn.query(`DELETE FROM chat_user WHERE connectionId='${userid}'`, () => {res()});
                                    }
                                    else {
                                        console.log(err);
                                        res();
                                    }
                                }
                                else {
                                    res();
                                }
                            }));
                            await ant;
                        }
                        conn.query(`INSERT INTO chat_message (userid, roomid, msg) VALUES ('${data[0].userid}', '${roomid}', '${message}')`, (err) => {
                            if(err) console.log(err);
                            res();
                        });
                    })
                }
            }
        })
    });
    
    await prom;
    
    return {
        statusCode: 200,
        body: "OK"
    };
};
