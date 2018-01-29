/**
 * @license
 * Visual Blocks Language
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
 * @fileoverview Generating JavaScript for list blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';
goog.provide('Blockly.JavaScript.lists');
goog.provide('Blockly.JavaScript.texts');
goog.require('Blockly.JavaScript');
var uniqueid = function() {
	return '_' + Math.random().toString(36).substr(2, 9);
};
Blockly.JavaScript['self_reference'] = function(block) {
	var text_reference = block.getFieldValue('reference');
	var text_value = block.getFieldValue('value');
	var code = '((((<<<<' + text_value + ' ==> ' + text_reference + '>>>>))))';
	return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['alternatives'] = function(block) {
	// Create a list with any number of elements of any type.
	var elements = new Array(block.itemCount_);
	for (var i = 0; i < block.itemCount_; i++) {
		elements[i] = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) || 'null';
	}
	var code = '(?:' + elements.join('|') + ')';
	return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['text'] = function(block) {
	// Text value.
	var code = block.getFieldValue('TEXT').replace(/'(.*)'/g, '$1');
	return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['command'] = function(block) {
	var text_command_id = block.getFieldValue('command_id');
	var dropdown_language = block.getFieldValue('Language');
	var text_example = block.getFieldValue('example');
	var elements = new Array(block.itemCount_);
	for (var i = 0; i < block.itemCount_; i++) {
		elements[i] = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) || 'null';
	}
	var value_contents = elements.join(' ');
	var msg = ['+'];
	var reply = ['- command_id: ' + text_command_id + ' ==> lang: ' + dropdown_language];
	var star_increment = 1;
	var contents_array = value_contents.split(/(\(\(\(\(\<\<\<\<.*?\>\>\>\>\)\)\)\)|\(\(\(\<\<\<.*?\>\>\>\)\)\)|LOOP\[\[\[.*?\]\]\])/gmy);
	for (var i = 0; i < contents_array.length; i++) {
		if (/LOOP\[\[\[.*?\]\]\]/.test(contents_array[i])) {
			var loopStar = star_increment++;
			var loop_data = /DATA\(\(\(\<\<\<(.*?)\>\>\>\)\)\)\]\]\]/.exec(contents_array[i])[1];
			var loop_data_array = loop_data.split(/(\(\(\(\<\<\<.*?\>\>\>\)\)\))/gmy);
			var loop_regex_array = [];
			var loop_elements_array = [];
			for (var j = 0; j < loop_data_array.length; j++) {
				if (/\(\(\(\<\<\<.*?\>\>\>\)\)\)/.test(loop_data_array[j])) {
					if (j == 1) {
						msg.push('(*');
					} else {
						msg.push('*');
					}
					loop_elements_array.push('"' + /\(\(\(\<\<\<(.*?)\>\>\>\)\)\)/.exec(loop_data_array[j])[1] + '"');
					loop_regex_array.push('(.*?)');
					star_increment++
				} else {
					if (loop_data_array[j].trim().length > 0) {
						if (j == 0) {
							msg.push('(' + loop_data_array[j].trim());
						} else {
							msg.push(loop_data_array[j].trim());
						}
						loop_regex_array.push(loop_data_array[j].trim());
					}
				}
			}
			msg.push('[*])');
			star_increment++
			reply.push(/ID\(\(\(\<\<\<(.*?)\>\>\>\)\)\)/.exec(contents_array[i])[1] + ': ' + 'IS_GROUPED: ' + /IS_GROUPED\(\(\(\<\<\<(.*?)\>\>\>\)\)\)/.exec(contents_array[i])[1] + ' SEPARATOR: ' + /SEPARATOR\(\(\(\<\<\<(.*?)\>\>\>\)\)\)/.exec(contents_array[i])[1] + ' REGEX: ' + loop_regex_array.join(' ') + ' ELEMENTS: [' + loop_elements_array.join(', ') + ']' + ' DATA: <star' + loopStar + '>');
		} else if (/\(\(\(\(\<\<\<\<.*?\>\>\>\>\)\)\)\)/.test(contents_array[i])) {
			var self_reference_array = /\(\(\(\(\<\<\<\<(.*?)\>\>\>\>\)\)\)\)/.exec(contents_array[i])[1].split(' ==> ');
			msg.push(self_reference_array[0]);
			reply.push(self_reference_array[1] + ': ' + 'itself');
		} else if (/\(\(\(\<\<\<.*?\>\>\>\)\)\)/.test(contents_array[i])) {
			msg.push('*');
			reply.push(/\(\(\(\<\<\<(.*?)\>\>\>\)\)\)/.exec(contents_array[i])[1] + ': ' + '<star' + star_increment++ + '>');
		} else {
			if (contents_array[i].trim().length > 0) {
				msg.push(contents_array[i].trim());
			}
		}
	}
	// TODO: Assemble JavaScript into code variable.
	var code = '\n// ' + text_example + '\n\n' + msg.join(' ') + '\n' + reply.join(' ==> ');
	return code;
};
Blockly.JavaScript['variable'] = function(block) {
	var text_variable = block.getFieldValue('variable');
	// TODO: Assemble JavaScript into code variable.
	var code = '(((<<<' + text_variable + '>>>)))';
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['dynamic_data'] = function(block) {
	var text_data_id = block.getFieldValue('data_id');
	var checkbox_grouped = block.getFieldValue('grouped') == 'TRUE';
	var text_separator = block.getFieldValue('separator');
	var elements = new Array(block.itemCount_);
	for (var i = 0; i < block.itemCount_; i++) {
		elements[i] = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) || 'null';
	}
	var value_data = elements.join(' ');
	// TODO: Assemble JavaScript into code variable.
	var code = 'LOOP[[[ID(((<<<' + text_data_id + '>>>)))IS_GROUPED(((<<<' + checkbox_grouped + '>>>)))SEPARATOR(((<<<' + text_separator + '>>>)))DATA(((<<<' + value_data + '>>>)))]]]';
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.JavaScript.ORDER_NONE];
};
