const consoleLog = console.log
console.log = function () {
  if (process.env.NEXT_PUBLIC_DEBUG) {
    consoleLog.apply(this, arguments)
  }
}

export {}
