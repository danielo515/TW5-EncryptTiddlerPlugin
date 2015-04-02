/*\
title: $:/plugins/danielo/encryptTiddler/encrypttiddler.js
type: application/javascript
module-type: widget

encrypttiddler widget

```

```


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var encryptTiddlerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
			{type: "tw-encrypt-tiddler", handler: "handleEncryptevent"},
			{type: "tw-decrypt-tiddler", handler: "handleDecryptevent"},
			]);
};

/*
Inherit from the base widget class
*/
encryptTiddlerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
encryptTiddlerWidget.prototype.render = function(parent,nextSibling) {
	console.log("Render");
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
encryptTiddlerWidget.prototype.execute = function() {
	// Get attributes
	 this.tiddlerTitle=this.getAttribute("tiddler",this.getVariable("currentTiddler"));
 	 this.passwordTiddler=this.getAttribute("passwordTiddler");
	// Construct the child widgets
	console.log(this.targetTiddler);
		this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
encryptTiddlerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};

encryptTiddlerWidget.prototype.handleEncryptevent = function(event){
	var password =this.getPassword();
	var title=this.tiddlerTitle;
	var tiddler = this.wiki.getTiddler(title);
	if(tiddler && password){
		var fields={text:"!This is an encrypted Tiddler",
					encrypted:this.encryptFields(title,password)};
		this.saveTiddler(tiddler,fields);

	}
};

encryptTiddlerWidget.prototype.handleDecryptevent = function(event){
	var password =this.getPassword();
	var title=this.tiddlerTitle;
	var tiddler = this.wiki.getTiddler(title);
	if(tiddler && password){
		var fields=this.decryptFields(tiddler,password);
		if(fields)this.saveTiddler(tiddler,fields);
	}
};

encryptTiddlerWidget.prototype.saveTiddler=function(tiddler,fields){
	this.wiki.addTiddler(  new $tw.Tiddler(this.wiki.getModificationFields(),tiddler,this.clearNonStandardFields(tiddler), fields ) )
}

encryptTiddlerWidget.prototype.encryptFields = function (title,password){
	var jsonData=this.wiki.getTiddlerAsJson(title);
	return $tw.crypto.encrypt(jsonData,password);

};

encryptTiddlerWidget.prototype.decryptFields = function(tiddler,password){
		var JSONfields =$tw.crypto.decrypt(tiddler.fields.encrypted,password);
		if(JSONfields!==null){
			return JSON.parse(JSONfields);
		}
		console.log("Error decrypting. Probably bad password")
		return false
};

encryptTiddlerWidget.prototype.getPassword = function(){
	var tiddler=this.wiki.getTiddler(this.passwordTiddler);
	if(tiddler){
		var password=tiddler.fields.text;
		this.saveTiddler(tiddler,this.clearNonStandardFields(tiddler)); //reset password tiddler
		return password;
	}

	return false
};

encryptTiddlerWidget.prototype.clearNonStandardFields =function(tiddler) {
	var standardFieldNames = "title tags modified modifier created creator".split(" ");
		var clearFields = {};
		for(var fieldName in tiddler.fields) {
			if(standardFieldNames.indexOf(fieldName) === -1) {
				clearFields[fieldName] = undefined;
			}
		}
		console.log("Cleared fields "+JSON.stringify(clearFields));
		return clearFields;
};

exports.encryptTiddler = encryptTiddlerWidget;

})();