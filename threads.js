const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  console.log("Begin Main thread");

  let worker = new Worker(__filename, {
    workerData: {
      outputPrefix: "Worker received message: ",
      timeToWaste: 500,
    },
  });

  worker.on("message", (message) => console.log(`Worker: ${message}`));

  worker.postMessage("Done with my job");

  console.log("End Main thread");
} else {
  parentPort.on("message", (message) => {
    console.log(`${workerData.outputPrefix}: ${message}`);
  });
  parentPort.postMessage("Begin Worker thread");
  wasteTime(workerData.timeToWaste);
  parentPort.postMessage("Worker in the middle");
  wasteTime(workerData.timeToWaste);
  parentPort.postMessage("End Worker thread");
}

function wasteTime(delay) {
  const end = Date.now() + delay;
  while (Date.now() < end) {}
}
