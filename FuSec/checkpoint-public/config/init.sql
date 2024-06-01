ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'REDACTED';
CREATE USER 'web'@'localhost' IDENTIFIED WITH mysql_native_password BY 'REDACTED';
FLUSH PRIVILEGES;

CREATE DATABASE wscorn;
USE wscorn;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    skey VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE todos (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    data VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, skey) VALUES ('admin', 'REDACTED', 'REDACTED');

GRANT INSERT, SELECT ON wscorn.users TO 'web'@'localhost';
GRANT INSERT, SELECT ON wscorn.todos TO 'web'@'localhost';
FLUSH PRIVILEGES;