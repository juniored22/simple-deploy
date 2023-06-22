const { exec } = require('child_process');
const http = require('http');
const url = require('url');
const util = require('util');

const private_key = process.env.PRIVATE_KEY;
const PORT = 9148;

const execPromise = util.promisify(exec);

// Handles the "pull" request
const handlePullRequest = async (queryParams, response) => {
  const { project } = queryParams;
  const projectPath = `/var/www/${project}`;
  const command = `git -C ${projectPath} pull origin master`;

  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    response.end(`${stderr} <br> ${stdout}`);
  } catch (err) {
    response.end(`exec error: ${err}`);
  }
};

// Handles the "status" request
const handleStatusRequest = async (queryParams, response) => {
  const { project } = queryParams;
  const projectPath = `/var/www/${project}`;
  const command = `git -C ${projectPath} status`;

  try {
    const { stdout } = await execPromise(command);
    response.end(stdout);
  } catch (err) {
    response.end(`exec error: ${err}`);
  }
};

// Handles the "log" request
const handleLogRequest = async (queryParams, response) => {
  const { project } = queryParams;
  const projectPath = `/var/www/${project}`;
  const command = `git -C ${projectPath} log --graph --abbrev-commit --decorate --date=relative --all`;

  try {
    const { stdout } = await execPromise(command);
    response.end(stdout);
  } catch (err) {
    response.end(`exec error: ${err}`);
  }
};

const server = http.createServer(async (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  const queryParams = url.parse(request.url, true).query;

  if (queryParams.key === private_key && request.method === 'POST') {
    if (queryParams.verbo === 'pull') {
      await handlePullRequest(queryParams, response);
    } else if (queryParams.verbo === 'status') {
      await handleStatusRequest(queryParams, response);
    } else if (queryParams.verbo === 'log') {
      await handleLogRequest(queryParams, response);
    }
  } else {
    // The response is sent when the key is invalid or the request method is not POST
    response.writeHead(401, { 'Content-Type': 'text/plain' });
    response.end('Unauthorized');
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
