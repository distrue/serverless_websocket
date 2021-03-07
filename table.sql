CREATE TABLE chat_user ( 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    userid VARCHAR(20), 
    roomid VARCHAR(20), 
    connectionid VARCHAR(24),
    isadmin BOOLEAN DEFAULT false 
);

CREATE TABLE chat_message (  
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    userid VARCHAR(20) NOT NULL,
    roomid VARCHAR(20) NOT NULL, 
    msg TEXT(65535),
    createdat DATETIME DEFAULT NOW()
);
