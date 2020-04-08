const exec = require('child_process').exec;
const http = require('http')
const url  = require('url')
const private_key = process.env.PRIVATE_KEY

http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/htmll'})
    var q = url.parse(req.url, true).query 
    
    if(q.key == private_key && req.method == 'POST'){

      if(q.verbo == 'pull'){
        const pull = exec(`git -C /var/www/${q.project}/ pull origin master`,(err,stdout, stderr) =>{
            if (err) {
                res.end(`exec error: ${err}`);
                return;
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            res.end(`${stderr} <br> ${stdout}`);
            
        });

      }

      if(q.verbo == 'status'){
            exec(`git -C /var/www/${q.project}/ status`)
            .stdout.on('data',(data) => {
                res.write(`${data}`)
            })
            .on('close',(data) =>{
                res.end(data)
            })

        }
        
        if(q.verbo == 'log'){
            exec(`git -C /var/www/${q.project}/ log --graph --abbrev-commit --decorate --date=relative --all`)
              .stdout.on('data',(data) =>{
                res.write(`${data}`)
              })
              .on('close',(data) =>{
                res.end(data)
              })
        }
    }
    else{
        res.writeHead(401, {'Content-Type': 'text/plain'});
        res.end('Unauthorized')
    }

}).listen(9148)

