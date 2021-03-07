const sdk = require('aws-sdk');
const path = require('path');
const { ArgumentParser } = require('argparse');

require('dotenv').config({
    path: path.join(__dirname , "..", ".env")
});

const man = new sdk.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    region: "ap-northeast-2",
    accessKeyId: process.env.awsaccessKeyId,
    secretAccessKey: process.env.awssecretkey,
    endpoint: process.env.endpoint
});

if(require.main === module) {
    const parser = new ArgumentParser({
        description: 'AWS SDK example for apigatewaymanagementapi'
    });
    
    parser.add_argument('-C', '--connection', { help: "websocket connection id" });
    const opt = parser.parse_args();

    console.log(opt.connection);

    man.getConnection({
        ConnectionId: opt.connection,
        // Data: "test"
    }, (err, data) => {
        if(err) console.log(err);
        else console.log(data);
    });
    
    man.postToConnection({
        ConnectionId: opt.connection,
        Data: JSON.stringify({action: "message", message: "hello user!"})
    }, (err, data) => {
        if(err) console.log(err);
        else console.log(data);
    });
    
    
}
