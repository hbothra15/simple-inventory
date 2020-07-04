export function getFormatDate (date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,0)}-${date.getDate().toString().padStart(2,0)}`
}

export function setFormatDate (value) {
    return new Date(value)
}

export function getItemKey(element) {
    return `${element.item.toLowerCase()}-${element.code.toLowerCase()}-${element.unit.toLowerCase()}`
}

export function getUniqueKeyFromDate () {
    var counter = window.localStorage.getItem('simple.inventory') | 0;
    if(counter === 99999) {
        counter = 0;
    }
    counter++;
    window.localStorage.setItem('simple.inventory', counter)
    return counter.toString().padStart(5,0)
}