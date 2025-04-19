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
#### Initialize Database (MySQL **8.0**)
- Import dump file using [MySQL Workbench](https://www.mysql.com/products/workbench/) (recommended): <br>
    - Drop and Create database (recommended):
        ```
        DROP DATABASE IF EXISTS `db-name`;
        CREATE DATABASE `db-name`;
        ```
    - Import /scripts/dump.sql
- **OR** import the following SQL files using [MySQL Workbench](https://www.mysql.com/products/workbench/) (recommended) in specified order: <br>
*When importing using dump file, you may encounter the error:
"...The user specified as a definer ('...'@'%') does not exist..."
If it occurs, try this importing method.*
    - Drop and Create database (recommended):
        ```
        DROP DATABASE IF EXISTS `db-name`;
        CREATE DATABASE `db-name`;
        ```
    - Import /scripts/db.sql
    - Import /scripts/trigger.sql
    - Import /scripts/product-with-image.sql
    - Import /scripts/data.sql
    - Import /scripts/report-1.sql
    - Import /scripts/report-2.sql
#### How To Run (Linux/MacOS)
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
- The server is now listening on ```127.0.0.1``` at the ```PORT``` specified in ```[name].env```.
- When deploying, ```--env=[name]``` option can be omitted, allowing the server to use environment variables set by the hosting machine.
#### How To Run (Windows)
- Similar to Linux/MacOS. However, to start the server, run below commands one by one in **Command Prompt** from the **same directory as /app.js**:
    ```
    SET DB_HOST=127.0.0.1
    SET DB_PORT=3306
    SET DB_NAME=db_name
    SET DB_USER=user_name
    SET DB_PASSWORD=user_password
    SET DB_SSL=false
    SET PORT=4000
    SET JWT_SECRET=secret
    npm start
    ```
- Note that the commands above have been tested locally, but this does not guarantee they will work on all Windows machines. The main problem is that Windows sets environment variables differently than Linux/MacOS. Be sure to set all environment variables properly as above, and then start the server using `npm start`.
