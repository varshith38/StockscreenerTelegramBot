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

            await saveData(identifier,list);

            return resolve(list);
        }catch(e){
            return reject(e);
        }
    })
}

const saveData = async (identifier,list) => {
    try{
        switch (identifier) {
            case 'PB':
                db.collection("positionalbuy").get().then((querySnapshot) => {
                    
                    if (querySnapshot.docs.length == 0){
                        list.forEach( i => {
                            db.collection('positionalbuy').add({
                                stockName: i.stockName,
                                price: i.price,
                                time: new Date(),
                                status: 'N'
                            })
                        })
                    }else{
                        let stocks = list.map( i => i.stockName)
                        querySnapshot.forEach( doc => {
                            console.log(doc.id)
                            console.log(doc.data().stockName)
                            if (stocks.includes(doc.data().stockName)){
                                db.collection('positionalbuy').doc(doc.id).set({
                                    stockName: doc.data().stockName,
                                    price: doc.data().price,
                                    time: new Date(),
                                    status: 'Y'
                                })
                            }else{
                                db.collection('positionalbuy').doc(doc.id).set({
                                    stockName: doc.data().stockName,
                                    price: doc.data().price,
                                    time: new Date(),
                                    status: 'N'
                                })
                            }
                        })
                    }
                }).catch(e => console.log(e.message));
                break;
            case 'IB':
                db.collection("intrabuy").get().then((querySnapshot) => {
                    
                    if (querySnapshot.docs.length == 0){
                        list.forEach( i => {
                            db.collection('intrabuy').add({
                                stockName: i.stockName,
                                price: i.price,
                                time: new Date(),
                                status: 'N'
                            })
                        })
                    }else{
                        let stocks = list.map( i => i.stockName)
                        querySnapshot.forEach( doc => {
                            console.log(doc.id)
                            console.log(doc.data().stockName)
                            if (stocks.includes(doc.data().stockName)){
                                db.collection('intrabuy').doc(doc.id).set({
                                    stockName: doc.data().stockName,
                                    price: doc.data().price,
                                    time: new Date(),
                                    status: 'Y'
                                })
                            }else{
                                db.collection('intrabuy').doc(doc.id).set({
                                    stockName: doc.data().stockName,
                                    price: doc.data().price,
                                    time: new Date(),
                                    status: 'N'
                                })
                            }
                        })
                    }
                }).catch(e => console.log(e.message));
                // let dbResult = await db.collection('intrabuy').add({list})
                // console.log(dbResult);
                break;
            default:
                break;
        }
    }catch(e){
        console.log(e.message)
    }

}

module.exports = getStockList;