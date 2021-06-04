/****************************************************************************************
                  Script to save or recover the values of form inputs
                   v2.1 written by Mark Wilton-Jones, 11-12/11/2003
         updated 5/10/2005 to allow specific inputs to be included or excluded
                   updated 4/03/2007 to allow Web Forms 2.0 inputs
*****************************************************************************************

Please see http://www.howtocreate.co.uk/jslibs/ for details and a demo of this script
Please see http://www.howtocreate.co.uk/jslibs/termsOfUse.html for terms of use

The script can save the values of:
text inputs
textareas
password inputs (optional)
radio buttons
checkbox inputs
select inputs

To use this, insert the following into the head of your document:

<script src="PATH TO SCRIPT/saveFormValues.js" language="javascript1.2" type="text/javascript"></script>

I suggest using my cookie script to save the form inputs into a cookie, which can be
recovered using the same script (the amount of form information that can be stored
will be limited by the maximum size of document.cookie - 4KB encoded):

<script src="PATH TO SCRIPT/saveFormValues.js" language="javascript1.2" type="text/javascript"></script>
<script src="PATH TO SCRIPT/cookie.js" language="javascript1.2" type="text/javascript"></script>
...
setCookie( 'formInputs', getFormString( document.forms.myForm, true ), 604800 );
...
recoverInputs( document.forms.myForm, retrieveCookie( 'formInputs' ), true );
...

This header file provides two functions:
var input_values_string = getFormString( reference to the form, bool: include password fields[, optional compareType: compare type, optional string: token list] );
recoverInputs( reference to the form, input_values_string, bool: include password fields[, optional compareType: compare type, optional string: token list] );

Opera 5 and 6 (not 7) will produce a prompt asking for permission to access password
fields. If many of your visitors use this browser, I suggest that you do not save
password values.

The token list option allows you to specify a list of inputs that you want to either
include or exclude from the saved values. The token list is a comma separated list of
name, class, or id values, such as 'name,email,address1'. The compare type option lets
you choose if you want to compare against the name, class (multiple classes are
supported), or id, and if you want to include or exclude inputs that match a token.
Note that the inputs will still need to be within the correct form.
Avaliable compareType values are:
FS_INCLUDE_NAMES   - Include elements with the specified names
FS_EXCLUDE_NAMES   - Exclude elements with the specified names 
FS_INCLUDE_IDS     - Include elements with the specified IDs
FS_EXCLUDE_IDS     - Exclude elements with the specified IDs
FS_INCLUDE_CLASSES - Include elements with the specified classes
FS_EXCLUDE_CLASSES - Exclude elements with the specified classes

Example:
setCookie( 'formInputs', getFormString( document.forms.myForm, true, FS_EXCLUDE_NAMES, 'CreditCard,SortCode' ), 604800 );
...
recoverInputs( document.forms.myForm, retrieveCookie( 'formInputs' ), true, FS_EXCLUDE_NAMES, 'CreditCard,SortCode' );


It is best not to use this script with forms whose inputs (or select options) are
generated with JavaScript.

Please see http://www.howtocreate.co.uk/tutorials/jsexamples/saveForm.html for
examples of how to use this script, and important notes.
_______________________________________________________________________________________*/

var FS_INCLUDE_NAMES = 0, FS_EXCLUDE_NAMES = 1, FS_INCLUDE_IDS = 2, FS_EXCLUDE_IDS = 3, FS_INCLUDE_CLASSES = 4, FS_EXCLUDE_CLASSES = 5;

function getFormString( formRef, oAndPass, oTypes, oNames ) {
	if( oNames ) {
		oNames = new RegExp((( oTypes > 3 )?'\\b(':'^(')+oNames.replace(/([\\\/\[\]\(\)\.\+\*\{\}\?\^\$\|])/g,'\\$1').replace(/,/g,'|')+(( oTypes > 3 )?')\\b':')$'),'');
		var oExclude = oTypes % 2;
	}
	for( var x = 0, oStr = '', y = false; formRef.elements[x]; x++ ) {
		if( formRef.elements[x].type ) {
			if( oNames ) {
				var theAttr = ( oTypes > 3 ) ? formRef.elements[x].className : ( ( oTypes > 1 ) ? formRef.elements[x].id : formRef.elements[x].name );
				if( ( oExclude && theAttr && theAttr.match(oNames) ) || ( !oExclude && !( theAttr && theAttr.match(oNames) ) ) ) { continue; }
			}
			var oE = formRef.elements[x]; var oT = oE.type.toLowerCase();
			if( oT == 'text' || oT == 'textarea' || ( oT == 'password' && oAndPass ) || oT == 'datetime' || oT == 'datetime-local' || oT == 'date' || oT == 'month' || oT == 'week' || oT == 'time' || oT == 'number' || oT == 'range' || oT == 'email' || oT == 'url' ) {
				oStr += ( y ? ',' : '' ) + oE.value.replace(/%/g,'%p').replace(/,/g,'%c');
				y = true;
			} else if( oT == 'radio' || oT == 'checkbox' ) {
				oStr += ( y ? ',' : '' ) + ( oE.checked ? '1' : '' );
				y = true;
			} else if( oT == 'select-one' ) {
				oStr += ( y ? ',' : '' ) + oE.selectedIndex;
				y = true;
			} else if( oT == 'select-multiple' ) {
				for( var oO = oE.options, i = 0; oO[i]; i++ ) {
					oStr += ( y ? ',' : '' ) + ( oO[i].selected ? '1' : '' );
					y = true;
				}
			}
		}
	}
	return oStr;
}

function recoverInputs( formRef, oStr, oAndPass, oTypes, oNames ) {
	if( oStr ) {
		oStr = oStr.split( ',' );
		if( oNames ) {
			oNames = new RegExp((( oTypes > 3 )?'\\b(':'^(')+oNames.replace(/([\\\/\[\]\(\)\.\+\*\{\}\?\^\$\|])/g,'\\$1').replace(/,/g,'|')+(( oTypes > 3 )?')\\b':')$'),'');
			var oExclude = oTypes % 2;
		}
		for( var x = 0, y = 0; formRef.elements[x]; x++ ) {
			if( formRef.elements[x].type ) {
				if( oNames ) {
					var theAttr = ( oTypes > 3 ) ? formRef.elements[x].className : ( ( oTypes > 1 ) ? formRef.elements[x].id : formRef.elements[x].name );
					if( ( oExclude && theAttr && theAttr.match(oNames) ) || ( !oExclude && ( !theAttr || !theAttr.match(oNames) ) ) ) { continue; }
				}
				var oE = formRef.elements[x]; var oT = oE.type.toLowerCase();
				if( oT == 'text' || oT == 'textarea' || ( oT == 'password' && oAndPass ) || oT == 'datetime' || oT == 'datetime-local' || oT == 'date' || oT == 'month' || oT == 'week' || oT == 'time' || oT == 'number' || oT == 'range' || oT == 'email' || oT == 'url' ) {
					oE.value = oStr[y].replace(/%c/g,',').replace(/%p/g,'%');
					y++;
				} else if( oT == 'radio' || oT == 'checkbox' ) {
					oE.checked = oStr[y] ? true : false;
					y++;
				} else if( oT == 'select-one' ) {
					oE.selectedIndex = parseInt( oStr[y] );
					y++;
				} else if( oT == 'select-multiple' ) {
					for( var oO = oE.options, i = 0; oO[i]; i++ ) {
						oO[i].selected = oStr[y] ? true : false;
						y++;
					}
				}
			}
		}
	}
}