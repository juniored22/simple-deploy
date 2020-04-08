# SIMPLE DEPLOY

### Description

A simple application to deploy to the server via POST with pull, status, and log go git methods

### Congiguration

port in file 9148
hash encrypted key with sh256
export PRIVATE_KEY=[sha256]


### Endpoint

#### Git Log
POST /?project=[name_project]&key=[private_key]&verbo=log 
HTTP/1.1
Host: [ip]:9148

#### Git status
POST /?project=[name_project]&key=[private_key]&verbo=status 
HTTP/1.1
Host: [ip]:9148

### Git pull
POST /?project=[name_project]&key=[private_key]&verbo=pull 
HTTP/1.1
Host: [ip]:9148

### Running
nohup nodejs deploy.js &!

### Stop
ps aux | grep deploy

kill -9 [PID]

### Tools
nodejs v4
Git

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
