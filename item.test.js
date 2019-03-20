const Cart = require('./cart');
const Item = require('./item')

test('string returning list', () => {
     let cart = new Cart();
     let item = new Item();
     var testItem=new Item('hg',6,true);
     var testList=[testItem];

     var myMap = new Map();

     myMap.set(testItem,6);
     
     cart.addItem(testItem,6);

     //console.log(cart.getItems());
   //  console.log(testList);
     
     expect(cart.getItems()).toEqual(myMap);
     expect(cart.getTotalPrice()).toBe(25);

     //console.log(cart.itemizedList());
});

