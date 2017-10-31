//聊天室服务端


const net=require('net');

var client=[];
//谁与我连接谁就是socket
var server=net.createServer((socket)=>{
	
	client.push(socket);
	
	console.log(`welcome ${socket.remoteAddress} to 2080 chatroom 当前在线 ${client.length}`);
	

function boardcast(signal){
	console.log(signal);
	//姓名 信息
	var username=signal.from;
	var message=signal.message;
	var send={
		protocol:signal.protocol,
		from:username,
		message:message
	};
	//开始广播
	client.forEach(clients=>{
		clients.write(JSON.stringify(send));
	});	
}

function p2p(signal){
	//console.log(signal);
	//姓名 信息
	var username=signal.from;
	var target=signal.to;
	var message=signal.message;
	var send={
		protocol:signal.protocol,
		from:username,
		message:message
	};
	//发送消息
	// client[target].write(JSON.stringify(send));
	client[target].write(JSON.stringify(send));
	
}
	
function clientData(chunk){
		//var username=chunk.username
		//var message=chunk.message
		//boardcast(username,message)
		//chunk:{"protocol"："boardcast","username","张三","忙什么呢？"}
		
	try{
		var signal=JSON.parse(chunk.toString().trim());
		var protocol=signal.protocol;
		switch(protocol){
			case 'boardcast':
				boardcast(signal);
				break;
			case 'p2p':
				p2p(signal);
				break;
			// case:'shake':
			// shake(signal);
			// break;
			default:
				socket.write('在忙吗？')
				break;
		}
	}catch(err){
		socket.write('出错了')
	}
}

	
	//console.log(`${socket.remoteAddress}:${socket.remotePort} 进来了`);
	//socket.write(`hello${socket.remoteAddress}:${socket.remotePort} 你来了`);
	
	//有客户端发来消息都会触发
	socket.on('data',clientData).on('error',(err)=>{
		
		 client=client.splice(client.indexOf(socket),1);
		
		 console.log(`${socket.remoteAddress} 下线了 当前在线${client.length}`);
	});	
});




var port=2080;
server.listen(port,(err)=>{
	if(err){
		console.log('端口被占用');
		return false;
	}
	console.log(`端口${port}正在被启动`);
});
