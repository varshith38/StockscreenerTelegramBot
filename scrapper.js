const puppeteer = require('puppeteer');
const firebaseApp = require('./model');
const db = firebaseApp.firestore();

function getStockList(url,identifier) {
    return new Promise( async (resolve, reject) => {
        try{
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            
            let list = await page.evaluate( () => {
                let results = [];
                let items = Array.from( document.querySelectorAll('tbody > tr'));
                items.splice(1).forEach( (item) => {
                    //console.log(item)
                    results.push({
                        stockName: item.children[2].innerText,
                        price: item.children[5].innerText,
                    });
                });
                return results;
            });
            await browser.close();

            
            console.log(dbResult)
            return resolve(list);
        }catch(e){
            return reject(e);
        }
    })
}

const saveData = async (identifier) => {
    
    switch (identifier) {
        case 'PB':
            break;
        case 'IB':
            let dbResult = await db.collection('intrabuy').add({list})
            
            break;
        default:
            break;
    }

}

module.exports = getStockList;