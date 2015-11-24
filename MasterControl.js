// Simple Controller Javascript Framework by Alexander Batista - 
// version 1.3


// ------------------------------------>
// TODO: remove view and modal and create controller and actions -> controllers have actions that will be called in a order
// ------------------------------------>

var MasterControl = function () {

    var mainApp = this;

    // keeps the list of controller that need to be called
    this.$$controllerList = [];
    this.$$modelList = [];
    this.$$viewList = [];

    var Controller = function () {
    };

    Controller.prototype.$$watch = [];

    // loops through watch array and calls every function
    Controller.prototype.digest = function () {
        var that = this;
        // will digest initial controller
        for (var i = 0; i < that.$$watch.length; i++) {
            var counter = 0;
            var functionName;
            // we found a controller on the page
            if (mainApp.$$controllerList.length > 0) {
                // loop through callback array and call them
                mainApp.$$controllerList.forEach(function (callback) {
                    // only call the ones that we find in the DOM
                    if (callback.scopeName === that.$$watch[i].controllerName) {
                        // callback(scope);
                        counter++
                        callback.aFunction();
                    }
                    else{
                        functionName = that.$$watch[i].controllerName;
                    }
                });
                // if couter is 0 then it did not find controller for attribute
                if (counter === 0) {
                    var errorMessage = "Error could not find contoller with name " + functionName;
                    throw new Error(errorMessage);
                }
            }
            else {
                var errorMessage = "Error could not find any Controllers";
                throw new Error(errorMessage);
            }
        }

        //clear the array
        that.$$watch = [];

    };

    this.module = function(appName, func){
        // calling inner fucntion
        func();
        this.init(appName);
    };

    this.init = function (appName) {

        // wait until everything is loaded on the page so that every javascript controller get loaded
        window.onload = function () {
            //look for main app controller 
            var moduleName = "[fan-app='" + appName + "']";
            var moduleArray = document.querySelectorAll(moduleName);

            if (moduleArray.length > 0) {

                for (var r = 0; r < moduleArray.length; r++) {
                    // select all controllers inside of the main app
                    var ControllerArray = moduleArray[r].querySelectorAll("[fan-controller]");

                    // loop through all controllers found inside the main app
                    if (ControllerArray.length > -1) {
                        for (var i = 0; i < ControllerArray.length; i++) {
                            // create a controller class for each one
                            var aController = new Controller();
                            var controllerName = ControllerArray[i].getAttribute("fan-controller");

                            // create a controller engine 
                            var contollerWatch = {
                                controllerName: controllerName,
                                scopeHtml: ControllerArray[i]
                            }

                            // send the controller to watch
                            aController.$$watch.push(contollerWatch);

                            // wait for last loop to call digest
                            if (i == ControllerArray.length -1) {
                                // calling the function that will call every function that relates
                                aController.digest();
                            }
                        }
                    }
                }
            }
            else{
                var errorMessage = "Error could not find application declaration";
                throw new Error(errorMessage);

            }
        };
    },

    // this gets called by the declairation of the function on the page
    this.controller = function (scopeName, aFunction) {
        // this will push an object into array
        var object = {
            scopeName: scopeName,
            aFunction: aFunction
        }
        mainApp.$$controllerList.push(object);
    },

    // this gets called first to load all the models 
    this.model = function (scopeName, aFunction) {
        // this will push an object into array
        var object = {
            scopeName: scopeName,
            aFunction: aFunction
        }
        mainApp.$$modelList.push(object);
    },

    // this will get the html and the object and return anonymous function 
    this.modelBind = function (modelName, dataObject) {
        var counter = 0;
        // loop through all models that were loaded 
        if (mainApp.$$modelList.length > 0) {
            // call an anonymous function that has object
            mainApp.$$modelList.forEach(function (callback) {
                // only call the ones that we find in the DOM
                if (callback.scopeName === modelName) {
                    counter++
                    callback.aFunction(dataObject);
                }
            });
            // if couter is 0 then it did not find controller for attribute
            if (counter === 0) {
                var errorMessage = "Error could not find model with name " + modelName;
                throw new Error(errorMessage);
            }
        }
        else {
            var errorMessage = "Error could not find any Model";
            throw new Error(errorMessage);
        }
    },

    // this gets called first to load all the Views
    this.View = function (scopeName, aFunction) {
        // this will push the function on to an array
        var object = {
            scopeName: scopeName,
            aFunction: aFunction
        }
        mainApp.$$viewList.push(object);

    },

    // this will get 
    this.viewbind = function(modelName, dataObject){
        // loop through all callback view functions

        var counter = 0;
        // loop through all models that were loaded 
        if (mainApp.$$viewList.length > 0) {
            // call an anonymous function that has object
            mainApp.$$viewList.forEach(function (callback) {
                // only call the ones that we find in the DOM
                if (callback.scopeName === modelName) {
                    counter++
                    callback.aFunction(dataObject);
                }
            });
            // if couter is 0 then it did not find controller for attribute
            if (counter === 0) {
                var errorMessage = "Error could not find View with name " + modelName;
                throw new Error(errorMessage);
            }
        }
        else {
            var errorMessage = "Error could not find any View";
            throw new Error(errorMessage);
        }
    }
};

// load the Application
// var app = new MasterControl();

// declare the Application
// app.module("nameofApp", function(){});

// declare Application in html
// fan-app="nameofapp"

// declare a Controller
// EXAMPLE:
// AdminApp.controller('name', function () {});

// declare a Controller in HTML
// EXAMPLE:
// fan-controller='name'

// declare a Model data Binder inside controller
// EXAMPLE: inside the model you will do your AJAX call
// AdminApp.modelBind('name', data);

// declare a Model first
// EXAMPLE: 
// AdminApp.model('name',function ( data ) {});

//declare a View can be inside of your Model / View can be inside your Controller
// EXAMPLE: DOM manipulation
// AdminApp.viewbind('name', data);

// declare a View first
// EXAMPLE: 
// AdminApp.view('name',function ( data ) {});
