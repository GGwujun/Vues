export let warn = null
export let tip = null

const hasConsole = typeof console !== 'undefined'
const classifyRE = /(?:^|[-_])(\w)/g
const classify = str => str
    .replace(classifyRE, c => c.toUpperCase())
    .replace(/[-_]/g, '')

warn = (msg, vm) => {
    if (hasConsole) {
        console.error(`[Vue warn]: ${msg}`)
    }
}

tip = (msg, vm) => {
    if (hasConsole) {
        console.warn(`[Vue tip]: ${msg}` + (
            ''
        ))
    }
}

