let id: number = 5;
//id = '5'; gives error

 // compile
 // go to proper dir
 // tsc index

 // make config 
 // tsc --init

 // basic types 
let idTwo: number = 5
let company: string = 'My Co'
let isTrue: boolean = true
let x: any = 'Hi'
x = 5

let ids: number[] = [1,2,3,4,5]
// ids.push('hi'); ERROR
let arr: any[] = [1, 'true']

// Tuple 
let person: [number, string, boolean] = [1, 'jo', true]
let employee: [number, string][]
employee = [
    [1, 'brad'],
    [2, 'joe'],
    [3, 'tom'],
]

// Union 
let idThree: string | number = 22

idThree = 'a string'

// Obj 

type User = {
    id: number,
    name: string
}
const user: User = {
    id: 1,
    name: 'Joe'
}

const personTwo: {
    id: number,
    name: string
} = {
    id: 1,
    name: 'Joe'
}

// type assertion 
let cid: any = 1
let customerId = <number>cid 
// customerId = true ERROR
let customerIdTwo = cid as number;

// functions
function addNum(x: number, y: number): number{
    return x + y;
}
// use node index to run
console.log(addNum(1,3))

function log(message: string | number): void{
    return console.log(message);
}

log('hello')
log('5')

// interfaces
interface UserInterface {
    readonly id: number,
    name: string,
    age?: number // Optional 
}
const user1: UserInterface = {
    id: 1,
    name: 'Joe'
}

//user1.id = 5; ERROR caz readonly

// type can be used with primitives 
type Point = number | string
// interface Point = number | string ERROR
const p1: Point = 1

interface MathFunc {
    (x: number, y: number): number
}

const add: MathFunc = (x: number, y: number): number => x + y;
//const add: MathFunc = (x: number, y: string): number => x + y; ERROR

const sub: MathFunc = (x: number, y: number): number => x - y;


interface PersonInterface {
    id: number,
    name: string,
    register(): string
}

// classes
class Person implements PersonInterface{
    //private id: number // public by default 
    id: number
    name: string

    constructor(id: number, name: string){
        console.log('in person constructor')
        this.id = id;
        this.name = name;
        
    }

    register(){
        return `${this.name} is now registered`
    }
}

const brad = new Person(1, 'jim')
console.log(brad)

console.log(brad.register)

// subclass
class Employee extends Person {
    position: string

    constructor(id: number, name: string, position: string){
        super(id, name)
        this.position = position;
    }
  
}

const emp = new Employee(4, 'Joebo', 'king')

console.log(emp.register)
console.log(emp.name)

// Generics 
// with any
function getArrayAny(items: any[]): any[]{
    return new Array().concat(items)
}
function getArray<T>(items: T[]): T[]{
    return new Array().concat(items)
}

let numArray = getArray<number>([1,2,4])
let strArray = getArray<string>(['name','bang','shame'])

let numArrayAny = getArrayAny([1,2,4])

// numArray.push("hi") //ERROR caz it knows it should be num
numArrayAny.push("hi") // not error caz any
