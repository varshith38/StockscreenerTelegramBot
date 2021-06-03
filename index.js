const { Telegraf } = require('telegraf');
const getStockList = require('./scrapper.js');

const bot = new Telegraf('1854295897:AAG6dGlue6V-5alxLi4zzOiEBUOh4A4xGaY');

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

    let result = await getStockList('https://chartink.com/screener/st-strategy-buy-positional','PB')
    let message = ''
    if (result){
        result.map( i => {
            if (message == ''){
                message = `${i.stockName}` + '  ------  ' + `${i.price}`
            }else{
                let str = `${i.stockName}` + '  ------  ' + `${i.price}`
                message += '\n' + str;
            }
        })
    }
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, message)

})

bot.action('IB', async (ctx) => {
    let result = await getStockList('https://chartink.com/screener/supertrend-strategy-66','IB')
    let message = ''
    if (result){
        result.map( i => {
            if (message == ''){
                message = `${i.stockName}` + '  ------  ' + `${i.price}`
            }else{
                let str = `${i.stockName}` + '  ------  ' + `${i.price}`
                message += '\n' + str;
            }
        })
    }
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, message)

})


bot.launch();