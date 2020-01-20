# Overview
An API to retreive members + retreive/modify/delete comments related info of a Github organization. 

# Set up
1. Clone this repository to local machine.
2. Paste .env file into the project folder (same level with Dockerfile, app.js)
3. By default the port will be mapped to port 9000 locally. 
If you wish to change this port, open docker-compose.yml file and on this line:
```
ports:
  - "9000:8000"
```
Change the first part (9000) to some other port number.

4. On the terminal, navigate to the project folder and type the following command.
```
docker-compose up
```
5. The server has been set up. You can now call the APIs.
*(Do remember to update the port number if you changed the default value in step 3.)*
For example retrieving all comments from Xendit organization
/GET http://localhost:9000/orgs/xendit/comments

# API Documentation
https://documenter.getpostman.com/view/10129882/SWT5hLEQ?version=latest
