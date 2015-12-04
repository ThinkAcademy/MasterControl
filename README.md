#Master Control is a JavaScript library for building moduler based applications.

##Why use MasterControl.JS?
Lots of people use Master Control as the C in MVC. Because Master Control doesn't force you into any mandatory technology stack, it's easy to start building on existing apps or completely build out your application using Master Control, it's that powerful. The idea behind using controllers is that it allows you to organize your code into module sections. This allows you to have better control of the work flow that your applications hinders to. No matter the size (BIG, small) or type (Non-SPA, SPA) of application this little library is able to handle it.

##Installation
Download the minified or commented version and add it to your project's JS library folder. Then add a script SRC link to your main   projects index page so that MasterControl gets loaded.
 ```
 <!-- The core MasterControl library -->
 <script src="http://myApp.com/javascript/MasterControl.js"></script>
 ```
### Getting started with HTML declarations - Step 1
 To get started you must declare your application by adding this HTML tag to your main DIV
   ```
   fan-app="appName"
   ```
 Inside your app declaration you can declare your Controller by adding this HTML tag
 ```
  fan-controller="controllerName"
  ```
 Inside your controller declaration you can declare your Action by adding this HTML tag
 
 ```
  fan-action="actionName"
  ```
  
 ``` 
   Example:
          <div fan-app="appName">
             <div fan-controller="controllerName">
               <div fan-action="actionName">
               
               </div>
             </div>
          </div>
 ```
 
### Getting started with Function declarations - Step 2
 In this step we will create a new Javascript file inside our application called
  ```
    app.js
  ```
 Now lets load our app.js file inside our application
  ```
    <!-- The core MasterControl library -->
  <script src="http://myApp.com/javascript/MasterControl.js"></script>
    <!-- The core MasterControl library -->
  <script src="http://myApp.com/javascript/app.js"></script>
  ```
 Inside our app.js lets do instantiate our library
  ```
  var app = MasterControl();
  ```
 Now let's declare our function application or module with the same name we used in the HTML APP declaration.
  ```
  app.module("appName", function(scope){
     console && console.log("Now this code will be excuted when the HTML Declaration is loaded: Module");
     // We also have access to the page scope. For example if you have jquery installed you can do something like $(scope)
  });
 ```
 Now lets declare our Controller by using the same name we used in the HTML Controller declaration.
   ```
   app.controller("controllerName", function(actions, scope){
      console && console.log("Now this code will be excuted when the HTML Declaration is loaded: Controller");
     // We also have access to the page scope. For example if you have jquery installed you can do something like $(scope)
     
     // WE ALSO HAVE ACCESS TO OUR ACTIONS FROM INSIDE OUR CONTROLLER, FOR EXAMPLE: 
      actions.actionName(function(){
       console && console.log("Now this code will be called: Action");
      });
  });
 ```
 Now lets declare our action by using the same name we used in the HTML Action declaration.
   ```
   app.action("actionNam", function(scope){
     console && console.log("Now this code will be excuted when the HTML Declaration is loaded: Action");
     // We also have access to the page scope. For example if you have jquery installed you can do something like $(scope)
  });
 ```
 You'll notice that we can declare an Action inside our controller and also as app.action. This allows you to decide how you want to organize your code flow. 
  
