// 聊天室客户端

const net=require('net');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('What is your name?',(name)=>{
	name=name.trim();
	if(!name){
		throw new Error('没名字未传入');
	}
	
	//创建与服务端的链接
	//var server = net.connect({port:2080,host:'192.168.3.56'},()=>{
		//服务端的端口和服务端的ip
	 var server = net.connect({port:2080},()=>{
		console.log(`welcome ${name} to 2080 chatroom`);
		
		//监听服务器端发来的消息
		server.on('data',(chunk)=>{
		try{
			var signal=JSON.parse(chunk.toString().trim());
			var protocol=signal.protocol;
			switch(protocol){
				case 'boardcast':
					console.log('\nboardcast['+signal.from+']> '+signal.message+'\n');
					rl.prompt();
					break;		
				case 'p2p':
					console.log('\np2p['+signal.from+']> '+signal.message+'\n');
					rl.prompt();
					break;
				default:
					server.write('在忙吗？')
					break;
			}
		}catch(err){	
			server.write('忙什么呢？')
		}		
	});		
		
	
		rl.setPrompt(name + '> ');
		
		rl.prompt();
		
		rl.on('line', (line) => {
			//错误处理
			line=line.toString().trim();
			var temp=line.split(':');
			var send;
			if(temp.length===2){
				//点对点
				send={
					protocol:'p2p',
					from:name,
					to:temp[0],
					message:temp[1]
				};					
				
			}else{
				//广播
				send={
					protocol:'boardcast',
					from:name,
					message:line
				};
				
			}
			server.write(JSON.stringify(send));	
			rl.prompt();
			
		});
		
		rl.on('close', () => {
		  // console.log('Have a great day!');
		  // process.exit(0);
		});
	});
});





















