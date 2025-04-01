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
#### How To Run
- Import /scripts/db.sql
- Import /scripts/data.sql
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