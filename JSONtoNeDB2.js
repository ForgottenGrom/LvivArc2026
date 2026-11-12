console.log("Програма утворення файла бази даних формату NeDB з JSON-файлу.")
let argList = process.argv
if (argList.length < 4) {
	console.log("Помилка: не вистачає параметрів!")
	console.log("Програмі потрібно передати два параметри. Формат виклику:")
	console.log("node JSONtoNeDB2 <початковий файл> <результуючий файл>")
	return
} else if (argList.length > 4) {
	console.log("Помилка: забагато параметрів!")
	console.log("Програмі потрібно передати два параметри. Формат виклику:")
	console.log("node JSONtoNeDB2 <початковий файл> <результуючий файл>")
	return
}

argList = process.argv.slice(2)
let inputFileName
let dbFileName
if (argList.length == 2) {
	inputFileName = argList[0]
	dbFileName = argList[1]
	const posIn = inputFileName.lastIndexOf(".")
	const posOut = dbFileName.lastIndexOf(".")
	if (posIn < 0) 
		inputFileName += ".json"
	else {
		inExt = inputFileName.slice(posIn).toLowerCase() 
		if (inExt !== ".json") {
			console.log("Помилка: неправильне розширення вхідного файлу:",inExt + "!")
			return
		}
	}
	if (posOut < 0) 
		dbFileName += ".json"
	else {
		dbExt = dbFileName.slice(posOut).toLowerCase() 
		if (dbExt !== ".json") {
			console.log("Помилка: неправильне розширення файла бази даних:",dbExt + "!")
			return
		}
	}
}

const Datastore = require('nedb')
const db = new Datastore({ filename: dbFileName, autoload: true })
const fs=require('fs')
if (fs.existsSync(dbFileName)) {
    fs.stat(dbFileName, (err, stats) => {
        if (err) {
            console.error(err)
            return
        }
        if (stats.size > 0) {
            throw("Помилка: файл " + dbFileName + " уже існує і непустий!")
        }
    })
}
let n = 0
// console.log("inputFileName=", inputFileName)
let data = fs.readFileSync(inputFileName)
// console.log("data=", data)
let list = JSON.parse(data)
for (let i=0; i < list.length; i++) {
    let obj = list[i]
    db.insert(obj, (err, newDoc) => { 
        n++
        if (i == list.length - 1) {
        console.log("Успішно створено файл БД " + dbFileName + " з " + n + " документами.")
        }
    })
}
