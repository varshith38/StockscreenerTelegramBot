const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const getStockList = require('./scrapper.js');
const firebaseApp = require('./model');
const db = firebaseApp.firestore();

const bot = new Telegraf('1854295897:AAG6dGlue6V-5alxLi4zzOiEBUOh4A4xGaY');

cron.schedule('*/15 9-16 * * 1-5', async () => {
    try{
        console.log('Running every 5 mins for intraday')
        getStockList('https://chartink.com/screener/supertrend-strategy-66','IB')
        .then( result => console.log(result))
        .catch(err => console.log(err.message));
    }catch(e){
        console.log(err.message)
    }

})

bot.command('start', (ctx) => {
    
    ctx.telegram.sendMessage(ctx.chat.id, '<b>Welcom to the stock screener</b>/nPlease select an option below to show the result', {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                     {text: 'Positonal', callback_data: 'PB'},
                     {text:'Intraday', callback_data: 'IB'}
                ]
            ]
        }
    })
})

bot.action('PB', async (ctx) => {
    try{
        console.log('Running at 3.35 for positional buy trades')
        await getStockList('https://chartink.com/screener/st-strategy-buy-positional','PB')
    }catch(e){
        console.log(err.message)
    }
    var message = '';
    db.collection("positionalbuy").get().then( (querySnapshot) => {
        
        if (querySnapshot.docs.length != 0){
            querySnapshot.forEach( i => {
                if (i.status == 'N'){
                    if (message == ''){
                        message = `${i.stockName}` + '  ------  ' + `${i.price}`
                    }else{
                        let str = `${i.stockName}` + '  ------  ' + `${i.price}`
                        message += '\n' + str;
                    }
                }
            })

            ctx.deleteMessage();
            ctx.telegram.sendMessage(ctx.chat.id, message)
        }else{
            ctx.deleteMessage();
            ctx.telegram.sendMessage(ctx.chat.id, 'No stocks found')
        }
    }).catch(err => console.log(err.message))
    
})

bot.action('IB', async (ctx) => {
    var message = '';
    db.collection("intrabuy").get().then( (querySnapshot) => {
        
        if (querySnapshot.docs.length != 0){
            
            querySnapshot.forEach( doc => {
                let i = doc.data()
                
                if (i.status == 'N'){
                    if (message == ''){
                        message = `${i.stockName}` + '  ------  ' + `${i.price}`
                    }else{
                        let str = `${i.stockName}` + '  ------  ' + `${i.price}`
                        message += '\n' + str;
                    }
                }
            })

            ctx.deleteMessage();
            ctx.telegram.sendMessage(ctx.chat.id, message)
        }else{
            ctx.deleteMessage();
            ctx.telegram.sendMessage(ctx.chat.id, 'No stocks found')
        }
    }).catch(err => console.log(err.message))
})


bot.launch();