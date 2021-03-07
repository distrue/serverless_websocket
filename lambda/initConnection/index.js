const mysql = require('mysql');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const connectionId = event.requestContext.connectionId;
    
    const conn = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });
    
    console.log(event);
    
    const prom = new Promise((res, rej) => {
        conn.query(`DELETE FROM chat_user where userid=${body.data.userid} and roomid=${body.data.roomid}`, () => {
            conn.query(`INSERT INTO chat_user(connectionId, userid, roomid, isadmin) VALUES ('${connectionId}', '${body.data.userid}', '${body.data.roomid}', ${body.data.isadmin})`, () => {
                res();
            });
        });
    });
    
    await prom;
    
    return {
        statusCode: 200,
        body: "OK"
    };
};
