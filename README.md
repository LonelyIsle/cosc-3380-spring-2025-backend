# DB Project: Point of Sale

This is the official github of Team 4 for COSC3380 Database Systems for the Monday Wednesday section.

#### Contributors
- Ozgel, Yusuf Burhan
- Santos, Jester Gutierrez
- Muirui, Johnbosco Kiarie
- Stewart, William D
- Tran, Hoang Long
#### Tech Stack
- [Node.js](https://nodejs.org/en)
- [MySQL](https://www.mysql.com/)
#### How To Run (Linux/MacOS)
- Import the following SQL files into MySQL in the specified order:
    - Drop and Create database (recommend):
        ```
        DROP DATABASE IF EXISTS `db-name`;
        CREATE DATABASE `db-name`;
        ```
    - /scripts/db.sql
    - /scripts/product-with-image.sql
    - /scripts/data.sql
- In project directory, execute the following commands
    ```
    npm install
    cp example.env [name].env
    npm start --env=[name]
    ```
- Example
    ```
    npm install
    cp example.env dev.env
    npm start --env=dev
    ```
- When deploying, ```--env=[name]``` option can be omitted, allowing the server to use environment variables set by the user.
- Note that even when using the ```--env=[name]``` option, the server will prioritize environment variables set by the user and ignore ```[name].env``` file.
#### How To Run (Windows)
- Similar to Linux/MacOS. However, to start the server, run below commands one by one in Command Prompt (PoweShell not tested) from the same directory as /app.js:
    ```
    SET DB_HOST=127.0.0.1
    SET DB_PORT=3306
    SET DB_NAME=db_name
    SET DB_USER=user_name
    SET DB_PASSWORD=user_password
    SET DB_SSL=false
    SET PORT=3000
    SET JWT_SECRET=secret
    npm start
    ```
