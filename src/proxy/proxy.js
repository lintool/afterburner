//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var aSchema=require('../core/aSchema.js');
var Afterburner=require('../core/afterburner.js').Afterburner;
var aTable=require('../core/aTable.js');
var dataSource=require('../core/dataSource.js');
var printSchema=require('../core/common.js').printSchema
var proxyConf = require('./proxyConf');
console.log(proxyConf);
abdb = new Afterburner();
global.daSchema = new aSchema();
global.abdb=abdb;

var fs = require('fs');
var monetdb = require('monetdb')();
var express = require('express');
//var atob=require('atob');
var options = {
	host     : proxyConf.monetdb.host, 
	port     : proxyConf.monetdb.port, 
	dbname   : proxyConf.monetdb.dbname, 
	user     : proxyConf.monetdb.user, 
	password : proxyConf.monetdb.password
};
var conn = new monetdb(options);
conn.connect();

//create pid file
fs.writeFile("/tmp/fserver.pid", process.pid +"", function(err) {
    if(err) {
        return console.log(err);
    }

   console.log("Pid file created");

function send_monetdb_query(res,qstr){
    conn.query(qstr).then(function(result){
      res.send(result);
    }).fail(function(result){
      res.send(result);
    });
}

function send_monetdb_query_json(res,qstr){
    conn.query(qstr).then(function(result){
      DEBUG("@send_monetdb_query_json type of result:"+typeof result);
      DEBUG("sending:"+res.length);
      res.json(result);
    }).fail(function(result){
      res.json(result);
    });
}
//REST API
var app = express();

app.get('/getSchema', function (req, res) {
   DEBUG("Got a GET /getSchema");
   send_monetdb_query(res,"select tables.name,columns.name,columns.type from tables,columns where tables.id=columns.table_id and tables.system=false and tables.type=0");
});

app.get('/getTableNames', function (req, res) {
   DEBUG("Got a GET /getTableNames");
   send_monetdb_query(res,"select tables.name from tables where tables.system=false and tables.type=0");
});


app.get('/getTables', function (req, res) {
   DEBUG("Got a GET /getTables");
   res.send('file server serving something carrying mem');
});
app.get('/query', function (req, res) {
  if (req.query.fsql){
    DEBUG('Got query fsql:'+req.query.fsql);
  }
  if (req.query.sql){
    DEBUG('Got query sql:'+req.query.sql);
    var desql=req.query.sql;
//    var desql=atob(req.query.sql);
//    console.log('Got query atob(sql):'+desql);
    send_monetdb_query_json(res,desql);
  }
  
});
app.get('/pull', function (req, res) {
  if (req.query.sql){
    console.log('Got pull sql:'+req.query.sql);
    conn.query(req.query.sql).then(function(result){
      var ds=new dataSource(result);
      console.log('ds.numrows:'+ ds.numrows);
      var tab=new aTable(ds);
      console.log("newTable.numrows:"+tab.numrows);
      res.send('ok');
    }).fail(function(result){
      res.send(result);
    }).catch(function(e){
      console.log(e);
    });
  }
  if (req.query.table){
    console.log('Got pull table:'+req.query.table);
    conn.query('SELECT * FROM '+req.query.table).then(function(result){
      var ds=new dataSource(result);
      console.log('ds.numrows:'+ ds.numrows);
      var tab=new aTable(ds);
      console.log("newTable.numrows:"+tab.numrows);
      res.send('ok');
    }).fail(function(result){
      res.send(result);
    });
  }
});
app.get(/.*js$/, function (req, res) {
  if (req.originalUrl.length>60)
    return;
   res.sendFile(req.originalUrl,{root:'../..'});
})
app.get(/.*html$/, function (req, res) {
  if (req.originalUrl.length>60)
    return;
   res.sendFile(req.originalUrl,{root:'../..'});
})
app.get(/.*afterburner.png$/, function (req, res) {
  if (req.originalUrl.length>60)
    return;
   res.sendFile(req.originalUrl,{root:'../..'});
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
//  Access-Control-Allow-Credentials: true
//  Access-Control-Allow-Methods: ACL, CANCELUPLOAD, CHECKIN, CHECKOUT, COPY, DELETE, GET, HEAD, LOCK, MKCALENDAR, MKCOL, MOVE, OPTIONS, POST, PROPFIND, PROPPATCH, PUT, REPORT, SEARCH, UNCHECKOUT, UNLOCK, UPDATE, VERSION-CONTROL
//  Access-Control-Allow-Headers: Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token, If
//  Access-Control-Expose-Headers: DAV, content-length, Allow
//
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var server = app.listen(proxyConf.proxy.lport, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
//
}); 
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting proxy');
}else delete module;
//////////////////////////////////////////////////////////////////////////////
