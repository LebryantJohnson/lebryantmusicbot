const {
    Client,
    Attachment
} = require('discord.js');
const bot = new Client();

const ytdl = require("ytdl-core");

const token = 'NzQ2NDUwNDg5MjQzMjA1NzYz.X0AgMQ.pB7vubQDKPIPdLgu-m5WBr3gn6A';

const PREFIX = '!'

var version = '1.2';

var servers = {};



bot.on('ready', () => {
    console.log('This bot is online!' + version);

})





bot.on('message', message=>{
     args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]){
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();
                
                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();

                    }
                
                });
            }



            if(!args[1]){
            message.channel.send("you need to provide a link!")
            return;
            }
            if(!message.member.voice.channel){
                message.channel.send("You must be in a chanel to play the music!");
                return;
            }

            if(!servers[message.guild.id]) servers [message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);


            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })
            
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("skipped!");
        break;
    }
});

bot.login(token);