// ==UserScript==
// @name         WhatsApp Web - Chat Bot
// @namespace    WACB
// @version      0.5.5
// @description  A chat bot for WhatsApp Web, with some basic commands. Check console for log.
// @author       Royalgamer06
// @match        https://web.whatsapp.com/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/felipeds/WhatsAppBot/master/bot.js
// @downloadURL    https://raw.githubusercontent.com/felipeds/WhatsAppBot/master/bot.js
// ==/UserScript==

//    
var botMSG = "";
var last_msg = "";
var jq = document.createElement('script');
jq.onload = function() {
    jQuery.noConflict();
    console.log('jQuery loaded');
    setTimeout(Main, 3500);
};
jq.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);



// REMOVE
function sendMsg(a)
{
    sendMessage(a);
}
function doJSLogic(texto)
{
    doBotLogic(texto);
    last_msg = texto;

}

function GM_xmlhttpRequest2()
{
    var obj;
    for (var i = 0; i < arguments.length; i++) {
        obj = arguments[i];
    }
    if(jQuery(".selectable-text").last().text() != "")
    {
        GM_xmlhttpRequest(obj);
    }
    else{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                obj.onload(this);
            }
        };
        xhttp.open(obj.method, obj.url, true);
        xhttp.send();
    }
}


//END REMOVE

function Main() {
    console.log("Marvin loaded");
    //jQuery("#pane-side").on("click", function() {
    //  setTimeout(listenToChat, 350);
    //});
    listenToChat();

}

function listenToChat() {
    //console.log("[WACB] Listening to chat");
    jQuery(".message-list").bind("DOMSubtreeModified", interpretNewChat(jQuery(".selectable-text").last().text()));

    last_msg = jQuery(".selectable-text").last().text();
    setInterval(function() {
        doBotLogic(jQuery(".selectable-text").last().text());
    }, 100);
}



function sendMessage(message) {
    console.log("BOT ENVIA:" + message);
    //ADD

    var evt = new Event('input', {
        bubbles: true
    });

    botMSG = message;
    var input = document.querySelector("div.input");
    if(input)
    {
        input.innerHTML = message;
        input.dispatchEvent(evt);

        document.querySelector(".icon-send").click();
    }


}



function getWeather(text)
{
    console.log(text);
    var url = "http://api.apixu.com/v1/forecast.json?key=d0c5d252848043d6af4210418162706&q="+ encodeURIComponent (text) +"&days=5";
    console.log(url);
    GM_xmlhttpRequest2({
        method: "GET",
        url: url,
        onload: function(response) {
            
            var json = JSON.parse(response.responseText);
            sendMsg("A Previsão do tempo para a cidade de " +  json['location']['name']  + ", "+ json['location']['region'] +  ", "+ json['location']['country']+ " é:");
            console.log(json['forecast']['forecastday'][0]);

            var texto = formatWeatherText(json['forecast']['forecastday'][0]);
            texto += formatWeatherText(json['forecast']['forecastday'][1]);
            texto += formatWeatherText(json['forecast']['forecastday'][2]);
            texto += formatWeatherText(json['forecast']['forecastday'][3]);

            //var texto = "*Hoje:* " + json['list'][0]['weather'][0]['description'] + " *Max:* " + ( json['list'][0]['main']['temp_max']- 273.15).toFixed(1) + " C\n";
            //dia 2
            // texto += "*Amanhã:* " + json['list'][1]['weather'][0]['description'] + " *Temperatura* " + ( json['list'][1]['main']['temp']- 273.15).toFixed(1) + " C\n";
            // texto += "*Depois de Amanhã:* " + json['list'][2]['weather'][0]['description'] + " *Temperatura* " + ( json['list'][2]['main']['temp']- 273.15).toFixed(1) + " C\n";
            sendMsg(texto);
        }
    });
}
function formatWeatherText(json)
{

    var rv = "*" +json['date'] + ":* ";
    rv += json['day']['condition']['text'];
    rv += " *Max:* " + ( json['day']['maxtemp_c']).toFixed(1) + " C ";
    rv += " *Min:* " + ( json['day']['mintemp_c']).toFixed(1) + " C\n";

    return rv;
}
function interpretNewChat(chat)
{
    var new_msg = chat;
    console.log("[WACB] New chat message: \n" + new_msg);
    if (new_msg.indexOf("!") === 0) {
        var cmd_line = new_msg.substring(1);
        var cmd = cmd_line.split(" ")[0];
        var args = cmd_line.split(" ").shift();
        if (cmd == "about") {
            sendMsg("I am a chat bot, made by Roy van Dijk.");
        }
    }
}

function doReplacesAndSendReply(message)
{
    var rv = message;
    var replaces = [
        ["murka","*MasterSum*"],
        ["danielz","*WeakAdmin*"]
    ];
    var shouldsend = false;
    for(var i = 0; i < replaces.length; i++)
    {
        if(message.toLowerCase().indexOf(replaces[i][0]) !== -1)
            {
                shouldsend = true;
            }
        var searchMask = replaces[i][0];
        var regEx = new RegExp(searchMask, "ig");
        var replaceMask = replaces[i][1];

        rv = rv.replace(regEx, replaceMask);
    }
    if(shouldsend)
        {sendMsg("Did you mean? \"" + rv + "\"") ;}
    
}

function funTranslation(type, args)
{
    var url = "http://api.funtranslations.com/translate/"+type+".json?text=" + encodeURIComponent(args.join(" "));
                console.log(url);

                GM_xmlhttpRequest2({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        var cota  = json.contents.translated;
                        sendMsg(cota);
                    }
                });
}

function wolfram(terms)
{
    //http://api.wolframalpha.com/v1/result?appid=VR2P7Y-44JJE9H58P&i=
    //VR2P7Y-44JJE9H58P
}

function doBotLogic(new_msg) {

    if (new_msg !== last_msg) {
        console.log("[WACB] New chat message: \n" + new_msg);

        var ignore = false;
        if(botMSG === new_msg)
        {
            ignore = true;
        }
        //  if( new_msg.indexOf("3D can die in a fire") !== -1 || new_msg.indexOf("Someone mentioned Murka. Did you mean MasterSum?") !== -1)
        //{
        //  ignore = true;
        // }
        last_msg = new_msg;

        if( new_msg.toLowerCase().indexOf("3d") !== -1 && !ignore)
        {
            sendMsg("3D can die in a fire") ;
        }
        if(!ignore)
            {doReplacesAndSendReply(new_msg);}
        
        
        if (new_msg.indexOf("!") === 0) {
            var cmd_line = new_msg.substring(1);
            var cmd = cmd_line.split(" ")[0];
            cmd = cmd.toLowerCase();
            var args = cmd_line.split(" ").slice(1);
            
            if(cmd == "g")
            {
                if(args.length > 0)
                {
                    sendMsg("http://lmgtfy.com/?q="+ args.join("+"));

                }
            }

            if(cmd == "bible")
            {
                var url = "http://labs.bible.org/api/?passage=" + encodeURIComponent(args.join(" ")) + "&formatting=plain";
                console.log(url);
                GM_xmlhttpRequest2({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        // var json = JSON.parse(response.responseText);
                        console.log(response.responseText);
                        sendMsg(response.responseText);
                    }
                });
            }

            if(cmd == "yoda")
            {/*
                /var url = "http://api.funtranslations.com/translate/yoda.json?text=" + encodeURIComponent(args.join(" "));
                console.log(url);

                GM_xmlhttpRequest2({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        var cota  = json.contents.translated;
                        sendMsg(cota);
                    }
                });*/
                funTranslation("yoda", args);
            }
            if (cmd == "l33t")
                {
                    funTranslation("leetspeak", args);
                }
            if(cmd == "weather")
            {
                var ar = "Campinas";
                if(args.length > 0)
                {
                    ar = args.join(" ");
                }
                getWeather(ar);
            }

            if(cmd == "math")
            {

                var url = "http://api.mathjs.org/v1/?expr=" + encodeURIComponent (args.join(" "));

                console.log(url);
                GM_xmlhttpRequest2({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        console.log(json);
                        sendMsg("A resposta para a formula "+args.join(" ")+" é : " + json);
                    }
                });
            }
            if(cmd== "cambio")
            {
                GM_xmlhttpRequest2({
                    method: "GET",
                    url: "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BRL",
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        var cota  = json.BRL;
                        sendMsg("A cotação do dolar agora é: " + cota.toFixed(2));
                    }
                });


            }

            if(cmd== "roll")
            {

                var supported = ["d4", "d6", "d8", "d10", "d12", "d20"];
                var found  = false;
                if( args.length > 0)
                {
                    for(var i = 0; i < 6; i++)
                    {
                        console.log("comparando "+ args[0] + " com " + supported[i]);
                        if(args[0].toLowerCase().indexOf(supported[i]) === 0)
                        {
                            found = true;
                            console.log(" achou");
                        }
                    }
                }

                if(!found)
                {
                    sendMsg("Digitou errado burrão, vc tem que digitar !roll e um dos valores:  "+ supported.join());
                }
                else
                {
                    var sides = args[0].substring(1);
                    var a = Math.floor(Math.random() * sides) + 1;
                    sendMsg("You rolled a " + args[0] + " and got: " + a);
                }

            }

            if (cmd == "joke") {
                GM_xmlhttpRequest2({
                    method: "GET",
                    url: "http://api.icndb.com/jokes/random?escape=javascript",
                    onload: function(response) {
                        var json = JSON.parse(response.responseText);
                        sendMsg(json.value.joke);
                    }
                });
            }
            
            if (cmd == "wa") {
                GM_xmlhttpRequest2({
                    method: "GET",
                    url: "http://api.wolframalpha.com/v1/result?appid=VR2P7Y-44JJE9H58P&i="  + args.join("+"),
                    onload: function(response) {
                       
                        sendMsg(response.responseText);
                    }
                });
            }
            if (cmd == "help") {
                var text = "Hello, I am Marvin, KPs What'sApp Bot. Here is what I can do:\n";
                text += "*!g [SEARCHTERMS]*: Friend can't use google? Show him how to. \n";
                text += "*!bible [VERSE(s)]*: I will quote a Bible verse, or multiple verses (eg: John 3:16-20) \n";
                text += "*!yoda [TEXT]*: Talk like Yoda I will\n";
                text += "*!weather [LOCATION]*: 4 days weather forecast\n";
                text += "*!cambio*: How many BRL is one USD worth? Find out\n";
                text += "*!roll [DICE]*: I can roll a dice for you. Accepted values: d4, d6, d8, d10, d12, d20 \n";
                text += "*!joke*: I will tell you a joke of my favorite dude on earth \n";
                text += "*!wa [TERMS]*: Wolfram|Alpha short answers \n";
                text += "*Did you know?* I also do a few other fun things like correct people when they mention the wrong person or talk about movies in a format that SSUUUCCKKSS \n";
                sendMsg(text);
            }
           
        }
    }
}