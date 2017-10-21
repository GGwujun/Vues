
//一个发布者 publisher
let pub = {
    publish() {
        dep.notify();
    }
}

//三个订阅者 subscribers

let sub1 = { update() { console.log(1) } }
let sub1 = { update() { console.log(1) } }
let sub1 = { update() { console.log(1) } }

//定义一个主题类
class Dep {
    constructor() {
        this.subs = [sub1, sub2, sub3];
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}

//发布者发布消息，主题对象执行notify方法，触发订阅者执行update方法
let dep = new Dep();
pub.publish()//1,2,3
