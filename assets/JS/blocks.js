/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview List blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';
goog.provide('Blockly.Blocks.lists'); // Deprecated
goog.provide('Blockly.Constants.Lists');
goog.provide('Blockly.Blocks.texts'); // Deprecated
goog.provide('Blockly.Constants.Text');
goog.require('Blockly.Blocks');
goog.require('Blockly');
/**
 * Common HSV hue for all blocks in this category.
 * This should be the same as Blockly.Msg.LISTS_HUE.
 * @readonly
 */
Blockly.Constants.Lists.HUE = 260;
/** @deprecated Use Blockly.Constants.Lists.HUE */
Blockly.Blocks.lists.HUE = Blockly.Constants.Lists.HUE;
Blockly.defineBlocksWithJsonArray([ // BEGIN JSON EXTRACT
	// Block for creating an empty list
	// The 'list_create_with' block is preferred as it is more flexible.
	// <block type="lists_create_with">
	//   <mutation items="0"></mutation>
	// </block>
	{
		"type": "lists_create_empty",
		"message0": "%{BKY_LISTS_CREATE_EMPTY_TITLE}",
		"output": "Array",
		"colour": "%{BKY_LISTS_HUE}",
		"tooltip": "%{BKY_LISTS_CREATE_EMPTY_TOOLTIP}",
		"helpUrl": "%{BKY_LISTS_CREATE_EMPTY_HELPURL}"
	},
	// Block for creating a list with one element repeated.
	{
		"type": "lists_repeat",
		"message0": "%{BKY_LISTS_REPEAT_TITLE}",
		"args0": [{
			"type": "input_value",
			"name": "ITEM"
		}, {
			"type": "input_value",
			"name": "NUM",
			"check": "Number"
		}],
		"output": "Array",
		"colour": "%{BKY_LISTS_HUE}",
		"tooltip": "%{BKY_LISTS_REPEAT_TOOLTIP}",
		"helpUrl": "%{BKY_LISTS_REPEAT_HELPURL}"
	},
	// Block for reversing a list.
	{
		"type": "lists_reverse",
		"message0": "%{BKY_LISTS_REVERSE_MESSAGE0}",
		"args0": [{
			"type": "input_value",
			"name": "LIST",
			"check": "Array"
		}],
		"output": "Array",
		"inputsInline": true,
		"colour": "%{BKY_LISTS_HUE}",
		"tooltip": "%{BKY_LISTS_REVERSE_TOOLTIP}",
		"helpUrl": "%{BKY_LISTS_REVERSE_HELPURL}"
	},
	// Block for checking if a list is empty
	{
		"type": "lists_isEmpty",
		"message0": "%{BKY_LISTS_ISEMPTY_TITLE}",
		"args0": [{
			"type": "input_value",
			"name": "VALUE",
			"check": ["String", "Array"]
		}],
		"output": "Boolean",
		"colour": "%{BKY_LISTS_HUE}",
		"tooltip": "%{BKY_LISTS_ISEMPTY_TOOLTIP}",
		"helpUrl": "%{BKY_LISTS_ISEMPTY_HELPURL}"
	},
	// Block for getting the list length
	{
		"type": "lists_length",
		"message0": "%{BKY_LISTS_LENGTH_TITLE}",
		"args0": [{
			"type": "input_value",
			"name": "VALUE",
			"check": ["String", "Array"]
		}],
		"output": "Number",
		"colour": "%{BKY_LISTS_HUE}",
		"tooltip": "%{BKY_LISTS_LENGTH_TOOLTIP}",
		"helpUrl": "%{BKY_LISTS_LENGTH_HELPURL}"
	}
]); // END JSON EXTRACT (Do not delete this comment.)
Blockly.Blocks['alternatives'] = {
	/**
	 * Block for creating a list with any number of elements of any type.
	 * @this Blockly.Block
	 */
	init: function () {
		this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
		this.setColour('#9c27b0');
		this.itemCount_ = 3;
		this.updateShape_();
		this.setOutput(true, 'String');
		this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
		this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
	},
	/**
	 * Create XML to represent list inputs.
	 * @return {!Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function () {
		var container = document.createElement('mutation');
		container.setAttribute('items', this.itemCount_);
		return container;
	},
	/**
	 * Parse XML to restore the list inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function (xmlElement) {
		this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
		this.updateShape_();
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function (workspace) {
		var containerBlock = workspace.newBlock('lists_create_with_container');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK')
			.connection;
		for (var i = 0; i < this.itemCount_; i++) {
			var itemBlock = workspace.newBlock('lists_create_with_item');
			itemBlock.initSvg();
			connection.connect(itemBlock.previousConnection);
			connection = itemBlock.nextConnection;
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function (containerBlock) {
		var itemBlock = containerBlock.getInputTargetBlock('STACK');
		// Count number of inputs.
		var connections = [];
		while (itemBlock) {
			connections.push(itemBlock.valueConnection_);
			itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
		}
		// Disconnect any children that don't belong.
		for (var i = 0; i < this.itemCount_; i++) {
			var connection = this.getInput('ADD' + i)
				.connection.targetConnection;
			if (connection && connections.indexOf(connection) == -1) {
				connection.disconnect();
			}
		}
		this.itemCount_ = connections.length;
		this.updateShape_();
		// Reconnect any child blocks.
		for (var i = 0; i < this.itemCount_; i++) {
			Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function (containerBlock) {
		var itemBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 0;
		while (itemBlock) {
			var input = this.getInput('ADD' + i);
			itemBlock.valueConnection_ = input && input.connection.targetConnection;
			i++;
			itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Modify this block to have the correct number of inputs.
	 * @private
	 * @this Blockly.Block
	 */
	updateShape_: function () {
		if (this.itemCount_ && this.getInput('EMPTY')) {
			this.removeInput('EMPTY');
		} else if (!this.itemCount_ && !this.getInput('EMPTY')) {
			this.appendDummyInput('EMPTY')
				.appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
		}
		// Add new inputs.
		for (var i = 0; i < this.itemCount_; i++) {
			if (!this.getInput('ADD' + i)) {
				if (i == 0) {
					this.appendDummyInput()
						.appendField('Alternatives');
					this.appendDummyInput()
						.appendField(new Blockly.FieldCheckbox("FALSE"), "optional")
						.appendField("Optional");
				}
				var input = this.appendValueInput('ADD' + i);
			}
		}
		// Remove deleted inputs.
		while (this.getInput('ADD' + i)) {
			this.removeInput('ADD' + i);
			i++;
		}
	}
};
Blockly.Blocks['command'] = {
	/**
	 * Block for creating a list with any number of elements of any type.
	 * @this Blockly.Block
	 */
	init: function () {
		this.itemCount_ = 3;
		this.updateShape_();
		this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
		this.setColour('#e91e63');
		this.setTooltip("");
		this.setHelpUrl("");
	},
	/**
	 * Create XML to represent list inputs.
	 * @return {!Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function () {
		var container = document.createElement('mutation');
		container.setAttribute('items', this.itemCount_);
		return container;
	},
	/**
	 * Parse XML to restore the list inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function (xmlElement) {
		this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
		this.updateShape_();
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function (workspace) {
		var containerBlock = workspace.newBlock('lists_create_with_container');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK')
			.connection;
		for (var i = 0; i < this.itemCount_; i++) {
			var itemBlock = workspace.newBlock('lists_create_with_item');
			itemBlock.initSvg();
			connection.connect(itemBlock.previousConnection);
			connection = itemBlock.nextConnection;
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function (containerBlock) {
		var itemBlock = containerBlock.getInputTargetBlock('STACK');
		// Count number of inputs.
		var connections = [];
		while (itemBlock) {
			connections.push(itemBlock.valueConnection_);
			itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
		}
		// Disconnect any children that don't belong.
		for (var i = 0; i < this.itemCount_; i++) {
			var connection = this.getInput('ADD' + i)
				.connection.targetConnection;
			if (connection && connections.indexOf(connection) == -1) {
				connection.disconnect();
			}
		}
		this.itemCount_ = connections.length;
		this.updateShape_();
		// Reconnect any child blocks.
		for (var i = 0; i < this.itemCount_; i++) {
			Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function (containerBlock) {
		var itemBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 0;
		while (itemBlock) {
			var input = this.getInput('ADD' + i);
			itemBlock.valueConnection_ = input && input.connection.targetConnection;
			i++;
			itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Modify this block to have the correct number of inputs.
	 * @private
	 * @this Blockly.Block
	 */
	updateShape_: function () {
		if (this.itemCount_ && this.getInput('EMPTY')) {
			this.removeInput('EMPTY');
		} else if (!this.itemCount_ && !this.getInput('EMPTY')) {
			this.appendDummyInput('EMPTY')
				.appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
		}
		// Add new inputs.
		for (var i = 0; i < this.itemCount_; i++) {
			if (!this.getInput('ADD' + i)) {
				if (i == 0) {
					this.appendDummyInput()
						.appendField("Command")
						.appendField(new Blockly.FieldTextInput("S6"), "command_id");
					this.appendDummyInput()
						.appendField("Language")
						.appendField(new Blockly.FieldDropdown([
							["English", "en"],
							["French", "fr"],
							["Arabic", "ar"],
							["Egyptian", "arz"],
							["Japanese", "ja"],
							["Chinese", "zh"],
							["Hindi", "hi"]
						]), "Language");
					this.appendDummyInput()
						.appendField("Example")
						.appendField(new Blockly.FieldTextInput("Set the value of textbox1 to Hello World !"), "example");
				}

				var input = this.appendValueInput('ADD' + i);
			}
		}
		// Remove deleted inputs.
		while (this.getInput('ADD' + i)) {
			this.removeInput('ADD' + i);
			i++;
		}
	}
};
Blockly.Blocks['lists_create_with_container'] = {
	/**
	 * Mutator block for list container.
	 * @this Blockly.Block
	 */
	init: function () {
		this.setColour(Blockly.Blocks.lists.HUE);
		this.appendDummyInput()
			.appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
		this.contextMenu = false;
	}
};
Blockly.Blocks['lists_create_with_item'] = {
	/**
	 * Mutator block for adding items.
	 * @this Blockly.Block
	 */
	init: function () {
		this.setColour(Blockly.Blocks.lists.HUE);
		this.appendDummyInput()
			.appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
		this.contextMenu = false;
	}
};
Blockly.Blocks['lists_indexOf'] = {
	/**
	 * Block for finding an item in the list.
	 * @this Blockly.Block
	 */
	init: function () {
		var OPERATORS = [
			[Blockly.Msg.LISTS_INDEX_OF_FIRST, 'FIRST'],
			[Blockly.Msg.LISTS_INDEX_OF_LAST, 'LAST']
		];
		this.setHelpUrl(Blockly.Msg.LISTS_INDEX_OF_HELPURL);
		this.setColour(Blockly.Blocks.lists.HUE);
		this.setOutput(true, 'Number');
		this.appendValueInput('VALUE')
			.setCheck('Array')
			.appendField(Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST);
		this.appendValueInput('FIND')
			.appendField(new Blockly.FieldDropdown(OPERATORS), 'END');
		this.setInputsInline(true);
		// Assign 'this' to a variable for use in the tooltip closure below.
		var thisBlock = this;
		this.setTooltip(function () {
			return Blockly.Msg.LISTS_INDEX_OF_TOOLTIP.replace('%1', thisBlock.workspace.options.oneBasedIndex ? '0' : '-1');
		});
	}
};
/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */
Blockly.Constants.Text.HUE = 160;
/** @deprecated Use Blockly.Constants.Text.HUE */
Blockly.Blocks.texts.HUE = Blockly.Constants.Text.HUE;
Blockly.defineBlocksWithJsonArray([ // BEGIN JSON EXTRACT
	// Block for text value
	{
		"type": "text",
		"message0": "%1",
		"args0": [{
			"type": "field_input",
			"name": "TEXT",
			"text": ""
		}],
		"output": "String",
		"colour": "#2196f3",
		"helpUrl": "%{BKY_TEXT_TEXT_HELPURL}",
		"tooltip": "%{BKY_TEXT_TEXT_TOOLTIP}",
		"extensions": ["text_quotes", "parent_tooltip_when_inline"]
	}
]); // END JSON EXTRACT (Do not delete this comment.)
/**
 *
 * @mixin
 * @package
 * @readonly
 */
Blockly.Constants.Text.QUOTE_IMAGE_MIXIN = {
	/**
	 * Image data URI of an LTR opening double quote (same as RTL closing double quote).
	 * @readonly
	 */
	QUOTE_IMAGE_LEFT_DATAURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAA' + 'n0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY' + '1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1' + 'HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMf' + 'z9AylsaRRgGzvZAAAAAElFTkSuQmCC',
	/**
	 * Image data URI of an LTR closing double quote (same as RTL opening double quote).
	 * @readonly
	 */
	QUOTE_IMAGE_RIGHT_DATAURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAA' + 'qUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhg' + 'gONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvB' + 'O3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5Aos' + 'lLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==',
	/**
	 * Pixel width of QUOTE_IMAGE_LEFT_DATAURI and QUOTE_IMAGE_RIGHT_DATAURI.
	 * @readonly
	 */
	QUOTE_IMAGE_WIDTH: 12,
	/**
	 * Pixel height of QUOTE_IMAGE_LEFT_DATAURI and QUOTE_IMAGE_RIGHT_DATAURI.
	 * @readonly
	 */
	QUOTE_IMAGE_HEIGHT: 12,
	/**
	 * Inserts appropriate quote images before and after the named field.
	 * @param {string} fieldName The name of the field to wrap with quotes.
	 * @this Blockly.Block
	 */
	quoteField_: function (fieldName) {
		for (var i = 0, input; input = this.inputList[i]; i++) {
			for (var j = 0, field; field = input.fieldRow[j]; j++) {
				if (fieldName == field.name) {
					input.insertFieldAt(j, this.newQuote_(true));
					input.insertFieldAt(j + 2, this.newQuote_(false));
					return;
				}
			}
		}
		console.warn('field named "' + fieldName + '" not found in ' + this.toDevString());
	},
	/**
	 * A helper function that generates a FieldImage of an opening or
	 * closing double quote. The selected quote will be adapted for RTL blocks.
	 * @param {boolean} open If the image should be open quote (“ in LTR).
	 *                       Otherwise, a closing quote is used (” in LTR).
	 * @returns {!Blockly.FieldImage} The new field.
	 * @this Blockly.Block
	 */
	newQuote_: function (open) {
		var isLeft = this.RTL ? !open : open;
		var dataUri = isLeft ? this.QUOTE_IMAGE_LEFT_DATAURI : this.QUOTE_IMAGE_RIGHT_DATAURI;
		return new Blockly.FieldImage(dataUri, this.QUOTE_IMAGE_WIDTH, this.QUOTE_IMAGE_HEIGHT, isLeft ? '\u201C' : '\u201D');
	}
};
/** Wraps TEXT field with images of double quote characters. */
Blockly.Constants.Text.TEXT_QUOTES_EXTENSION = function () {
	this.mixin(Blockly.Constants.Text.QUOTE_IMAGE_MIXIN);
	this.quoteField_('TEXT');
};
Blockly.Extensions.register('text_quotes', Blockly.Constants.Text.TEXT_QUOTES_EXTENSION);
Blockly.Blocks['variable'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("Variable")
			.appendField(new Blockly.FieldTextInput(""), "variable");
		this.setOutput(true, null);
		this.setColour('#ff5722');
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
Blockly.Blocks['self_reference'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("Self reference to ")
			.appendField(new Blockly.FieldTextInput(""), "reference");
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC", 15, 15, "*"))
			.appendField(new Blockly.FieldTextInput(""), "value")
			.appendField(new Blockly.FieldImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==", 15, 15, "*"));
		this.setOutput(true, null);
		this.setColour('#ffeb3b');
		this.setTooltip("");
		this.setHelpUrl("");
	}
};
