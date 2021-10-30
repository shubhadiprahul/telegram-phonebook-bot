require('dotenv').config()
const express = require('express');
const app = express()
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.DB_URL
const port = process.env.DB_PORT
const bot = new TelegramBot(token, { polling: true });
const fs = require('fs')
app.use(express.json())
app.use(express.urlencoded())
var main_controller =[]
var post_data ={}

app.get('/',(req,res)=>{
    res.send({"sucess":"successfully connect......."})
})

const checkernumber = (num)=>{
    let checker_string = "1234567890"
    for(let i of num){
        if (!(checker_string.includes(i))){
            return false
        }
    }
    return true
}

const init = async(bot) =>{
    // starting bot
    bot.on('message', (msg) => {
    // for adding number
    var message = msg.text
    console.log(message);
    if(message==="/start"){
        main_controller[0]="/start"
        bot.sendMessage(msg.from.id, " Welcome ")
        bot.sendMessage(msg.chat.id,"/start /search /create ")  
    }

        // For adding conctact(Name and Number) 
        if(message==="/create") {
            main_controller[0]="/create"
            bot.sendMessage(msg.chat.id,"Please enter a name" );
            
        }
        // For saving contacts 
    if(message==="/save") {
        main_controller[0]="/save"
        var data =fs.readFileSync('./data/data.json',"utf-8")
        console.log(String(data).includes(String(post_data.mobile)));
        if(String(data).includes(String(post_data.mobile))){
            // res.send("Already exist")
            bot.sendMessage(msg.chat.id,"Number already exist")
        }else if(post_data.mobile){
            data = JSON.parse(data)
            data.push(post_data)
            data = JSON.stringify(data,null,4);
            console.log(data);
            fs.writeFile('./data/data.json', data, 'utf8', (err) => {
                if (err) {
                    console.log(`Error writing file: ${err}`);
                    bot.sendMessage(msg.chat.id,"Something went wrong")
                } else {
                    console.log(`File is written successfully!`);
                    bot.sendMessage(msg.chat.id,"Successfully saved!" );
                    bot.sendMessage(msg.chat.id,"press on your desire route" );
                    // bot.sendMessage(msg.chat.id,"/start /search /create ")
                }
            });
        }
        else {
            bot.sendMessage(msg.chat.id,"/start /search /create ")
            // bot.sendMessage(msg.chat.id,"Please first the fill name and number")
        }
           
        }
        
    if (message==="/search"){
        main_controller[0]="/search"

        bot.sendMessage(msg.chat.id,"enter a name" );
        
        
        }
    if (main_controller[0]==="/search" && message!=="/search"){
        var name = message
        var data = fs.readFileSync("./data/data.json","utf-8")
        data = JSON.parse(data)

        search_list = "Name    -    Number"

        for(let i of data){
            console.log(i.name,name);
            if (i.name.includes(name)){
                search_list+=`\n${i.name}   -  ${i.mobile}`
            }
        }
        bot.sendMessage(msg.chat.id,"I find something for you" );
        bot.sendMessage(msg.chat.id, search_list);
    }

    if (main_controller[0]==="/create" && message!=="/create"){
        // let message = msg.text.toString()
        if(checkernumber(message)){
            if (message.length>=10 && message.length <= 12){
                post_data.mobile = message
                console.log(post_data);
                bot.sendMessage(msg.chat.id,"If you change some number or name then directly edit  and click on save to save your contact /save")
            }else{
                bot.sendMessage(msg.chat.id,"Please enter a number" )
            }
        }else{
            bot.sendMessage(msg.chat.id,"Please enter a number" )
            post_data.name = message
        }
    }
    //for start
    if(main_controller[0]=== "/start" && message!=="/start"){
        var Hi = "hi";
        if (message.toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
            }

    }

    })
}

app.listen(port,async()=>{
    console.log(`Server is running on ${port}`)
    await init(bot)

})




