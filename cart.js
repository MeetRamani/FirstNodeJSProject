const Item = require('./item');
var totalCost;
class Cart {
    
    constructor() {

        this.list=[];
        this.myMap = new Map();

        this.getItems = () => {
            return this.myMap;
        }
        this.getTotalPrice = () => {
            return totalCost;
        }

        this.addItem = (item, quantity)=>{ 
            //var item1 = new Item();
            //this.list.push(item); 
           // this.myMap.set(item.name , list.name); 
           //this.myMap.set(item.price , list.price); 
           // this.myMap.set(item.onSale , list.onSale); 
            this.myMap.set(item,quantity);
            totalCost = totalCost + (this.myMap.get(item). * quantity;
            console.log(totalCost);
        }

        this.itemQuantities= () =>{
            return null;
        }

        this.onSaleItems= () =>{
            return null;
        }
    }

    itemizedList (){
        return this.myMap;
    }
}

module.exports = Cart;
