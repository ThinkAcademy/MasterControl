// Simple MVC JAVSCRIPT framework by Alexander Batista - MIT Licensed
// version 1.4

// NO CONTROLLER OR ACTION OR MODULE CAN HAVE THE SAME NAME

var MasterControl = function () {

    // keeps the list of controller that need to be called
    var $$controllerList = [];
    var $$methodList = [];
    var $$actionList = [];
    var $$controllerWatch = [];

    var init = function (appName) {

        // this makes sure the declarations of modules, controllers, actions get loaded first.
        window.onload = function () {
            //look for main app controller 
            var moduleName = "[fan-app='" + appName + "']";
            var moduleArray = document.querySelectorAll(moduleName);

            // check that we find an app declaration
            if (moduleArray.length > -1) {
                // for each fan-app 
                for (var r = 0; r < moduleArray.length; r++) {

                    // select all controllers inside of the main app
                    var controllerArray = moduleArray[r].querySelectorAll("[fan-controller]");

                    // check that we find a controller declaration inside the app declaration
                    if (controllerArray.length > -1) {

                        // loop through all controllers found inside the main app
                        for (var i = 0; i < controllerArray.length; i++) {

                            var controllerName = controllerArray[i].getAttribute("fan-controller");

                            // create a controller engine 
                            var controllerWatcher = {
                                controllerName: controllerName,
                                controllerScope: controllerArray[i], // scope is the html of the containing declaration
                                actions : []
                            };

                            // find actions inside the controller declaration
                            var actionArray = controllerArray[i].querySelectorAll("[fan-action]");

                            if (actionArray.length > -1) {

                                for (var r = 0; r < actionArray.length; r++) {

                                    var actionName = actionArray[i].getAttribute("fan-action");

                                        // create a action engine 
                                        var actionWatcher = {
                                            actionName: actionName,
                                            actionScope: actionArray[i] // scope is the html of the containing declaration
                                        }

                                        // push to action array inside the controller watch
                                        controllerWatcher.actions.push(actionWatcher);
                                }

                            };

                            // send the controller to watch
                            $$controllerWatch.push(controllerWatcher);

                            // wait for last loop to call digest
                            if (i == controllerArray.length - 1) {
                                // calling the function that will call every function that relates
                                digest();
                            }
                        }

                    }

                }
            }
        };
    };


    // loops through watch array and calls every function
    var digest = function () {

        // Error Handling
        if ($$controllerWatch.length === $$controllerList.length){
            var errorMessage = "Error your missing an HTML controller declaration or an function controller declaration";
            throw new Error(errorMessage);
        }

        // loop through all controller html delcarations
        for (var i = 0; i < $$controllerWatch.length; i++) {
           
            var controllerMatchCounter = 0;

            // loop through all function declarations
            $$controllerList.forEach(function (callback) {

                // only call the declarations that match
                if (callback.scopeName === $$controllerWatch[i].controllerName) {
                    controllerMatchCounter++;
                    callback.aFunction();

                    //loop through html controller list
                    for (var p = 0; p < $$controllerWatch[i].actions.length; p++) {

                        var actionMatchCounter = 0;

                        // loop through function action list 
                        $$actionList.forEach(function (actionCallBack) {

                            if (actionCallBack.scopeName === $$controllerWatch[i].actions[p].actionName ) {

                                actionCallBack.aFunction();
                            }

                        });
                    }

                    // if action counter is 0 then it did not find action controller with html name
                    if (actionMatchCounter === 0) {
                        var errorMessage = "Error could not find any function action declaration with name " + $$controllerWatch[i].controllerName;
                        throw new Error(errorMessage);
                    }

                }

            });

            // if controller counter is 0 then it did not find function controller with html name
            if (controllerMatchCounter === 0) {
                var errorMessage = "Error could not find any function controller declaration with name " + $$controllerWatch[i].controllerName;
                throw new Error(errorMessage);
            }
        }

        //clear the array
        $$controllerWatch = [];

    };

    // return only the api that we want to use
    return {
            
            module : function(appName, func){
                // calling inner fucntion
                func();
                init(appName);
            },

            // this gets called by the declairation of the function on the page
            controller : function (scopeName, aFunction) {
                // this will push an object into array
                var object = {
                    scopeName: scopeName,
                    aFunction: aFunction
                }

                $$controllerList.push(object);
            },

            // this gets called by the declairation of the function on the page
            action : function (scopeName, aFunction) {
                // this will push an object into array
                var object = {
                    scopeName: scopeName,
                    aFunction: aFunction
                }

                $$actionList.push(object);
            },

            // this will call any methods that we create
            callMethod : function (methodName, dataObject) {

                    var counter = 0;
                    // loop through all models that were loaded 
                    if ($$methodList.length > 0) {
                        // call an anonymous function that has object
                        $$methodList.forEach(function (callback) {
                            // only call the ones that we find in the DOM
                            if (callback.scopeName === methodName) {
                                counter++
                                callback.aFunction(dataObject);
                            }
                        });
                        // if couter is 0 then it did not find controller for attribute
                        if (counter === 0) {
                            var errorMessage = "Error could not find method with name " + methodName;
                            throw new Error(errorMessage);
                        }
                    }
                    else {
                        var errorMessage = "Error could not find any methods";
                        throw new Error(errorMessage);
                    }
                },

                // this gets called first to load all the Views
            method : function (scopeName, aFunction) {
                    // this will push the function on to an array
                    var object = {
                        scopeName: scopeName,
                        aFunction: aFunction
                    }

                    $$methodList.push(object);

                },

    }
};


// load the Application
// var app = MasterControl();

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

// declare a Action
// EXAMPLE:
// AdminApp.action('name', function () {});

// declare a action in HTML inside of controller
// EXAMPLE:
// fan-action='name'

// EXAMPLE: inside the controllers you can call call actions
// AdminApp.callMethod('name', data);

// declare a Mothod 
// EXAMPLE: 
// AdminApp.method('name', function ( data ) {});

// order of operation
// app module, app controller, app action,

// app module can load menu, footer and anything else you want every page to have

// app controller can load the general page

// app action can load specific html and specific items 



// DIFFERENT WAYS TO BUILD YOUR APPLICATION

/*
AdminApp.controller('name', function () {
    console && console.log("controller");
    AdminApp.action("name", function(){
            console && console.log("action");
    });
});
// application can be written like this
AdminApp.controller('name', function (actions) {
    console && console.log("controller");
});
AdminApp.action('name', function (actions) {
    console && console.log("action");
});
*/
