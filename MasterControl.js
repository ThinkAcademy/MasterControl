// A simple controller Based JAVSCRIPT framework by Alexander Think - MIT Licensed - ThinkAcademy.io
// version 1.4

var MasterControl = function () {

    // keeps the list of controller that need to be called
    var $$controllerList = [];
    var $$methodList = [];
    var $$actionList = [];
    var $$controllerWatch = [];

    var init = function (appName, func) {

        // this makes sure the declarations of modules, controllers, actions get loaded first.
        window.onload = function () {
            //look for main app controller 
            var moduleName = "[fan-app='" + appName + "']";
            var module = document.querySelector(moduleName);
            var routing = "";
            // checks to see if master routing is instantiated
            if(typeof MasterRouter !== 'undefined'){
                routing = MasterRouter(module);
            }

            // select all controllers inside of the main app
            var controllerArray = module.querySelectorAll("[fan-controller]");

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
                        func(module);
                        digest();
                    }
                }

            }
        };
    };


    // loops through watch array and calls every function
    var digest = function () {

        // loop through all controller html delcarations
        for (var i = 0; i < $$controllerWatch.length; i++) {
           
            var controllerMatchCounter = 0;
            var actionMatchCounter = 0;
            // loop through all function declarations
            $$controllerList.forEach(function (callback, index) {

                // before we look for a match lets clean up the controller name
                var controllerNameSplit = callback.controllerName.split(":");
                var controllerName = controllerNameSplit[0];

                if(controllerNameSplit[1] === "id"){
                    actionMatchCounter++;
                }

                // only call the declarations that match
                if (controllerName === $$controllerWatch[i].controllerName) {
                    controllerMatchCounter++;

                    var actionObject = {}
                    // loop through and call all actions inside of function
                    for (var r = 0; r < $$controllerWatch[i].actions.length; r++) {
                        var innerAction = $$controllerWatch[i].actions[r];
                        actionObject[innerAction.actionName] = function(func){
                            func(innerAction.actionScope);
                            // remove action you just called from list of actions to call
                           $$controllerWatch[i].actions = $$controllerWatch[i].actions.splice(r, 1);
                        };

                    };

                    callback.aFunction(actionObject, $$controllerWatch[i].controllerScope);

                    //loop through html controller list
                    for (var p = 0; p < $$controllerWatch[i].actions.length; p++) {
                        var outerAction = $$controllerWatch[i].actions[p]

                        // loop through function action list 
                        $$actionList.forEach(function (actionCallBack) {

                            if (actionCallBack.controllerName === $$controllerWatch[i].controllerName && actionCallBack.actionName === $$controllerWatch[i].actions[p].actionName) {
                                actionMatchCounter++;
                                actionCallBack.aFunction(outerAction.actionScope);
                            }

                        });

                        // if action counter is 0 then it did not find action controller with html name
                        if (actionMatchCounter === 0) {
                            var errorMessage = "Error could not find any function action declaration with name " + $$controllerWatch[i].actions[p].actionName + " for controller " + $$controllerWatch[i].controllerName;
                            throw new Error(errorMessage);
                        }

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
                init(appName, func);
            },

            // this gets called by the declairation of the function on the page
            controller : function (controllerName, aFunction) {
                // this will push an object into array
                var object = {
                    controllerName: controllerName,
                    aFunction: aFunction
                }

                $$controllerList.push(object);
            },

            // this gets called by the declairation of the function on the page
            action : function (controllerName, actionName, aFunction) {
                // this will push an object into array
                var object = {
                    controllerName: controllerName,
                    actionName: actionName,
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

                }

    }
};

/********************************************************************************************************************************/
/************************************************ LOADING YOUR APPLICATION EXAMPLES *********************************************/
/********************************************************************************************************************************/

// load the Application
// var app = MasterControl();

// declare the Application
// app.module("nameofApp", function(scope){});

// declare Application in html
// fan-app="nameofapp"

// declare a Controller
// EXAMPLE:
// AdminApp.controller('name', function (action, scope) {});

// declare a Controller in HTML
// EXAMPLE:
// fan-controller='name'

// declare a Action
// EXAMPLE:
// AdminApp.action('controllerName', name', function (scope) {});

// declare a Action in HTML inside of controller
// EXAMPLE:
// fan-action='name'

// EXAMPLE: inside the controllers you can call call actions
// AdminApp.callMethod('name', data);

// declare a Mothod 
// EXAMPLE: 
// AdminApp.method('name', function ( data ) {});


/********************************************************************************************************************************/
/******************************************* MANY DIFFERENT WAYS TO DECLAIR ACTIONS *********************************************/
/********************************************************************************************************************************/


/*
AdminApp.controller('name', function (action, scopeController) {
    console && console.log("inside controller");
    AdminApp.action('CONTROLLER NAME', "name", function(scopeAction){
            console && console.log("inside action");
    });
});
AdminApp.controller('name', function (scopeController) {
    console && console.log("inside controller");
});
AdminApp.action('controller name','name', function (scopeAction) {
    console && console.log("inside action");
});
AdminApp.controller('name', function (action, scopeController) {
    console && console.log("inside controller");
    action.nameOfAction(function(scopeAction){
        console && console.log("inside action");
    });
});
*/

