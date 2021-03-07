const mysql = require('mysql');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
    } catch(err) {}
    const connectionId = context.requestContext.connectionId;
    
    const conn = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });
    
    console.log(event);
    
    const prom = new Promise((res, rej) => {
        conn.query(`INSERT INTO chat_user(userid, roomid, isadmin) VALUES ('${connectionID}', 'temporary', false)`, () => {
            res();
        });
    });
    
    await prom;
    
    return {
        statusCode: 200,
        body: "OK"
    };
};
