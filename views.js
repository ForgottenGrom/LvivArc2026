exports.main = (req, res) => {
    const Datastore = require('@seald-io/nedb')
    const db = new Datastore({ filename: 'lvivarc.json', autoload: true })
    db.find({ "table": "arctype" }, (err, docs) => {
        if (err) {
            console.log(err)
            return
        }
        docs.sort((a, b) => { return (a.id - b.id) })
        res.render(path + '/index2', { types: docs })
    })
}

exports.arcObject = (req, res) => {
    objId = parseInt(req.params.id)
    const Datastore = require('@seald-io/nedb')
    const db = new Datastore({ filename: 'lvivarc.json', autoload: true })
    db.findOne({ table: "arcobj", id: objId }, (err, doc) => {
        if (err) {
            console.log(err)
        } else if (!doc) {
            res.sendFile(path + '404.html')
        } else {
            db.findOne({ table: "arctype", id: doc.type_id }, (err, tp) => {
                res.render(path + '/object', { object: doc, type: tp })
            })
        }
    })
}

exports.listObjects = (req, res) => {
    tpId = parseInt(req.params.id)
    Datastore = require('@seald-io/nedb')
    db = new Datastore({ filename: 'lvivarc.json', autoload: true })
    db.find({ table: "arcobj", type_id: tpId }, (err, docs) => {
        if (docs.length == 0) {
            res.sendFile(path + '404.html')
        } else {
            db.findOne({ table: "arctype", id: tpId }, (err, doc) => {
                res.render(path + '/objects', { type: doc, objects: docs })
            })
        }
    })
}

exports.error404 = (req, res) => {
    res.sendFile(path + '404.html')
}
