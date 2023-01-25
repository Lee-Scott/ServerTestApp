var id = 5;
//id = '5'; gives error
// compile
// go to proper dir
// tsc index
// make config 
// tsc --init
// basic types 
var idTwo = 5;
var company = 'My Co';
var isTrue = true;
var x = 'Hi';
x = 5;
var ids = [1, 2, 3, 4, 5];
// ids.push('hi'); ERROR
var arr = [1, 'true'];
// Tuple 
var person = [1, 'jo', true];
var employee;
employee = [
    [1, 'brad'],
    [2, 'joe'],
    [3, 'tom'],
];
// Union 
var idThree = 22;
idThree = 'a string';
var user = {
    id: 1,
    name: 'Joe'
};
var personTwo = {
    id: 1,
    name: 'Joe'
};
// type assertion 
var cid = 1;
var customerId = cid;
// customerId = true ERROR
var customerIdTwo = cid;
// functions
function addNum(x, y) {
    return x + y;
}
// use node index to run
console.log(addNum(1, 3));
function log(message) {
    return console.log(message);
}
log('hello');
log('5');
var user1 = {
    id: 1,
    name: 'Joe'
};
// interface Point = number | string ERROR
var p1 = 1;
var add = function (x, y) { return x + y; };
//const add: MathFunc = (x: number, y: string): number => x + y; ERROR
var sub = function (x, y) { return x - y; };
// classes
var Person = /** @class */ (function () {
    function Person(id, name) {
        console.log('in person constructor');
        this.id = id;
        this.name = name;
    }
    Person.prototype.register = function () {
        return "".concat(this.name, " is now registered");
    };
    return Person;
}());
var brad = new Person(1, 'jim');
console.log(brad);
console.log(brad.register);
