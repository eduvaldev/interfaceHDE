const config = {
    host:'http://localhost:5000/',
    base_url: 'http://localhost:5000/api/',
    //host:'http://159.203.85.88/',
    //base_url: 'http://159.203.85.88/api/',
    token:'ihde',
    expire:'expire',
    expireTime: 3600*1000*2,//Expire after 2 hours
    role: {
        superAdmin:'superAdmin',
        admin: 'admin',
        stuff: 'stuff',
        client: 'client'
    }
}

export default config
