const express = require('express');
const app = express();
const os = require("os");
const cluster = require("cluster");
const clusterWorkerSize = os.cpus().length;
const cors = require("cors");

// configuring env file
require("dotenv").config({path:"./.env"});

// handling cors
app.use(cors());
app.use(express.json());

const port = process.env.PORT

// health check
app.get("/",(req,res) => {
    res.send({status:200,message: "Health ok !"})
});

// server setup
if (clusterWorkerSize > 1 && 1 == 2) {
    if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i++) {
            cluster.fork();
        }
        cluster.on("exit", function (worker) {
            console.log("Worker", worker.id, " has exitted.")
        });
    } else {
        app.listen(port, () => {
            console.log(`Express server listening on port ${port} and worker ${process.pid}`);
        });
    }
} else {
    app.listen(port, () => {
        console.log(`Express server listening on port ${port} with the single worker ${process.pid}`);
    });
}

// ERROR CATCHING
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1)
})