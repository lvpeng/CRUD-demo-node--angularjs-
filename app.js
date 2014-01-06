/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 12/30/13
 * Time: 3:58 PM
 * To change this template use File | Settings | File Templates.
 */
var express = require('express');
var app = express();

//Configuration
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});
app.configure('development',function(){
    app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});

app.configure('production',function(){
    app.use(express.errorHandler());
});

function User(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
};

var UserRepository = {};

UserRepository.users = [
        {firstName:"Lv", lastName:"peng", id:1},
        {firstName:"Li", lastName:"Monan",id:2},
        {firstName:"Yu", lastName:"liqun", id:3},
        {firstName:"Gao", lastName:"wei", id:4}
    ];
UserRepository.getAll = function(){
     return this.users;
};

UserRepository.getById = function(id){
    // send back user by userid
    var foundUser = false;
    for(var i=0;i< this.users.length;i++){
       var user = this.users[i];
        if(user.id == id ){
            foundUser = true;
            return user;
        }
    }

}


UserRepository.addNewUser = function(firstName, lastName) {
    var newUser = new User(this.getMaxUserId() + 1, firstName, lastName);
    this.users.push(newUser);
    return this.getById(newUser.id);
};


UserRepository.deleteUser = function(id) {
    // sorry, i'm tired and don't know javascript that well...
    var indexToDelete = -1;
    for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        if (user.id == id) {
            indexToDelete = i;
            break;
        };
    };

    if (indexToDelete >= 0) {
        this.users.splice(indexToDelete, 1);
    };

};


UserRepository.changeUser = function(id, firstName, lastName) {
    var user = this.getById(id);
    user.firstName = firstName;
    user.lastName = lastName;
    return user;
};

UserRepository.getMaxUserId = function() {
    return Math.max.apply(Math, this.users.map(function(user) {
        return user.id;
    }));
};


/* REST API =========================================== */
var baseUrl = '/api';

/* GET ALL -------------------------------------------- */
app.get(baseUrl + '/users', function(req, res) {
    res.send(UserRepository.getAll());
});
app.get(baseUrl + '/users/:id', function(req, res) {
    //console.log('trying to retrieve user with id: ' + req.params.id);

    var user = UserRepository.getById(req.params.id);
    res.json(user);
});


/* POST Create ---------------------------------------- */
app.post(baseUrl + '/users', function(req, res) {
    if(!req.body.hasOwnProperty('firstName') || !req.body.hasOwnProperty('lastName')) {
        res.statusCode = 400;
        return res.send('Error 400: POST syntax incorrect.');
    }

    var newUser = UserRepository.addNewUser(req.body.firstName, req.body.lastName);
    //res.json(true);
});
//
/* PUT (Update) --------------------------------------- */
app.put(baseUrl + '/users/:id', function (req, res) {
    if(!req.body.id || !req.body.firstName || !req.body.lastName) {
        res.statusCode = 400;
        return res.send('Error 400: PUT syntax incorrect.');
    }
    var changedUser = UserRepository.changeUser(req.params.id, req.body.firstName, req.body.lastName);
    res.json(changedUser);
});

/* DELETE --------------------------------------------- */
app.delete(baseUrl + '/users/:id', function(req, res) {
    //console.log('trying to delete user with id: ' + req.params.id);
    UserRepository.deleteUser(req.params.id);
    res.json(true);
});



app.listen(3000);
console.log('Server listening on Port 3000');



