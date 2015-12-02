# MasterControl
 LOADING YOUR APPLICATION EXAMPLES 

 load the Application
 var app = MasterControl();

declare the Application
app.module("nameofApp", function(){});

declare Application in html
fan-app="nameofapp"

declare a Controller
EXAMPLE:
AdminApp.controller('name', function () {});

declare a Controller in HTML
EXAMPLE:
fan-controller='name'

declare a Action
EXAMPLE:
AdminApp.action('controllerName', name', function () {});

declare a action in HTML inside of controller
EXAMPLE:
fan-action='name'

EXAMPLE: inside the controllers you can call call actions
AdminApp.callMethod('name', data);

declare a Mothod 
EXAMPLE: 
AdminApp.method('name', function ( data ) {});


 MANY DIFFERENT WAYS TO DECLAIR ACTIONS

AdminApp.controller('name', function () {
    console && console.log("inside controller");
    AdminApp.action('CONTROLLER NAME', "name", function(){
            console && console.log("inside action");
    });
});

AdminApp.controller('name', function (action) {
    console && console.log("inside controller");
    action.nameOfAction(function(){
        console && console.log("inside action");
    });
});

AdminApp.controller('name', function () {
    console && console.log("inside controller");
});
AdminApp.action('controller name','name', function () {
    console && console.log("inside action");
});
