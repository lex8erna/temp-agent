var generatori = angular.module('generatori', ['firebase', 'bootstrap']);

// Bootstrap module
// here you should keep adding more directives leading to a
// better Bootstrap-AngularJS integration :)
angular.module('bootstrap', []).directive('button', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {

            // ignore other kind of button groups (e.g. buttons-radio)
            if (!element.parent('[data-toggle="buttons-checkbox"].btn-group').length) {
                return;
            }

            // set/unset 'active' class when model changes
            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                element.toggleClass('active', ctrl.$viewValue);
            });

            // update model when button is clicked
            element.bind('click', function(e) {
                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(!ctrl.$viewValue);
                });
                $scope.resizer();
                // don't let Bootstrap.js catch this event,
                // as we are overriding its data-toggle behavior.
                e.stopPropagation();
            });
        }
    };
});


function setInnerHTML(eID, contents){
    document.getElementById(eID).innerHTML = contents;
}

function setBootstrapColumnWidth(eID, width){
    document.getElementById(eID).className = document.getElementById(eID).className.replace(/col-md-[0-9]*/, "col-md-"+width);
}

function stripHTML(source){
    source = source.replace(/\<!doctype.*\>/i, "");
    source = source.replace(/\<\ *\/\ *head\ *\>/i, "");
    source = source.replace(/\<\ *footer\ *\>.*\<\ *\/\ *footer\ *\>/i, "");
    source = source.replace(/\<\ *\/?\ *body\ *\>/gi, "");
    return source;
}

var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

var delayedResize;
var resize;
function init () {
    var text = document.getElementById('templateField');
    resize = function () {
        text.style.height = 'auto';
        var scrollLimit = 500;
        var newHeight = (text.scrollHeight <= scrollLimit) ? text.scrollHeight : scrollLimit;
        text.style.height = newHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    delayedResize = function () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
}

generatori.controller('genCtrl', ['$scope', '$firebase',
  function ($scope, $firebase) {
    var ref = new Firebase('https://temporalvectorspiral.firebaseio.com/templates');
    $scope.templates = $firebase(ref);

    
    // Editing area
    $scope.fields = new Array();
    $scope.templateOn = true;
    $scope.previewOn = true;
    $scope.fieldOn = true;
    $scope.fullPageMode = false;
    $scope.keys = 1;
    $scope.selectedTemplate = 'one';
    $scope.templateEditMode = true;

    var getSelection = function (){
        return $scope.selectedTemplate;
    }

    // Setting template
    $scope.updateTemplate = function (template) {
        var updatePair = {body : $scope.templates[template].body};
        ref.child(template).update(updatePair);
        //ref.child(template).update({body: $scope.templates[template].body}});
    }

    $scope.resizer = function(){
        var visibleParts = ($scope.templateOn + $scope.previewOn + $scope.fieldOn);
        if (visibleParts == 0) return;
        var divisions = 12/visibleParts;
        setBootstrapColumnWidth('previewDiv', divisions);
        setBootstrapColumnWidth('templateDiv', divisions);
        setBootstrapColumnWidth('fieldDiv', divisions);
    }

    $scope.updateFields = function () {
        $scope.fieldSearch = $scope.templates[getSelection()].body.match(/{{[A-Za-z]*}}/g);
        // Populating fields from regex matches
        for (var i = 0; i < $scope.fieldSearch.length; i++){
            $scope.fields[i] = new Object();
            // Strip off leading and trailing curly braces
            $scope.fields[i].name = $scope.fieldSearch[i].substring(2, $scope.fieldSearch[i].length -2);
            $scope.fields[i].val = "";
        }
    }

    // Persisting template memory
    var originalTemplate;
    var currentView;
    $scope.updateTemplateView = function () {
        if (originalTemplate == null){
            originalTemplate = $scope.templates[getSelection()].body;
        }
        var fields = $scope.fields;
        var changedTemplate = originalTemplate;
        for (var i = 0; i < fields.length; i++){
            changedTemplate = changedTemplate.replace("{{"+fields[i].name+"}}", fields[i].val);
        }
        $scope.templates[getSelection()].body = changedTemplate;
        setInnerHTML("preview", stripHTML(changedTemplate));
        setInnerHTML("fullPreview", stripHTML(changedTemplate));
    }

    // Wait for the template to load, and then update the fields.
    $scope.$watch('templates.' + getSelection() + ".body", function(newValue, oldValue) { 
        $scope.updateFields();
        resize();
        delayedResize();
        $scope.loaded = true;
        $scope.keys = $scope.templates.$getIndex();
    }); 
}]);