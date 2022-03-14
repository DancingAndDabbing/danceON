ace.define("ace/theme/willie_custom",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-willie-custom";
exports.cssText = ".ace-willie-custom .ace_gutter {\
background: #FBFBFB;\
color: rgb(158,157,167)\
}\
.ace-willie-custom .ace_scroller.ace_scroll-left {\
    box-shadow: initial!important;\
}\
.ace-willie-custom .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-willie-custom {\
background-color: #FBFBFB;\
color: #403F53\
}\
.ace-willie-custom .ace_cursor {\
color: #403F53\
}\
.ace-willie-custom .ace_marker-layer .ace_selection {\
background: rgba(128, 128, 128, 0.22)\
}\
.ace-willie-custom.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #f2f2f2;\
border-radius: 2px\
}\
.ace-willie-custom .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-willie-custom .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(180, 180, 180, 1.0)\
}\
.ace-willie-custom .ace_marker-layer .ace_active-line {\
background: #f2f2f2\
}\
.ace-willie-custom .ace_gutter-active-line {\
color: #CCCCCC;\
}\
.ace-willie-custom .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(128, 128, 128, 0.22)\
}\
.ace-willie-custom .ace_fold {\
background-color: #994CC3;\
border-color: #403F53\
}\
.ace-willie-custom .ace_keyword {\
color: #0C969B\
}\
.ace-willie-custom .ace_constant.ace_language {\
color: #BC5454\
}\
.ace-willie-custom .ace_constant.ace_numeric {\
color: #AA0982\
}\
.ace-willie-custom .ace_constant.ace_character {\
color: #C96765\
}\
.ace-willie-custom .ace_constant.ace_other {\
color: #C96765\
}\
.ace-willie-custom .ace_support.ace_function {\
color: #0C969B\
}\
.ace-willie-custom .ace_support.ace_constant {\
color: #0C969B\
}\
.ace-willie-custom .ace_support.ace_class {\
font-style: italic;\
color: #0C969B\
}\
.ace-willie-custom .ace_support.ace_type {\
font-style: italic;\
color: #0C969B\
}\
.ace-willie-custom .ace_storage {\
color: #0C969B\
}\
.ace-willie-custom .ace_storage.ace_type {\
font-style: italic;\
color: #0C969B\
}\
.ace-willie-custom .ace_invalid {\
color: rgba(248, 248, 240, 1.0);\
background-color: rgba(249, 38, 114, 1.0)\
}\
.ace-willie-custom .ace_invalid.ace_deprecated {\
color: rgba(248, 248, 240, 1.0);\
background-color: rgba(174, 129, 255, 1.0)\
}\
.ace-willie-custom .ace_string {\
color: #4876D6\
}\
.ace-willie-custom .ace_comment {\
font-style: italic;\
color: #989FB1\
}\
.ace-willie-custom .ace_variable {\
color: #C96765\
}\
.ace-willie-custom .ace_variable.ace_parameter {\
font-style: italic;\
color: #4876D6\
}\
.ace-willie-custom .ace_entity.ace_other.ace_attribute-name {\
color: #0C969B\
}\
.ace-willie-custom .ace_entity.ace_name.ace_function {\
color: #994CC3\
}\
.ace-willie-custom .ace_entity.ace_name.ace_tag {\
color: #0C969B\
}\
.ace-willie-custom .ace_paren {\
color: #994CC3\
}\
.ace-willie-custom .ace_punctuation.ace_operator {\
color: #0C969B\
}\
.ace-willie-custom .ace_gutter-cell.ace_error {\
background-image: unset;\
background-position: unset;\
background-repeat: no-repeat;\
}\
.ace-willie-custom .ace_gutter-cell.ace_error:before {\
content: '!';\
position: absolute;\
display: inline-block;\
left: 4px;\
background-color: #D3423E;\
border: 1px solid #D3423E;\
border-radius: 2px;\
color: white;\
font-weight: 900;\
}\
.ace-willie-custom .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHjy8NJ/AAjgA5fzQUmBAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/willie_custom"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
