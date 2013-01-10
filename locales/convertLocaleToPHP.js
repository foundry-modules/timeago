var fs = require("fs");

function createHeader() {

	var out = "";

	out += " <?php\n"
	out += " /** \n"
	out += " * @package %PACKAGE%\n"
	out += " * @subpackage %FIELD.SUBPACKAGE%\n"
	out += " * @license GNU/GPL, see LICENSE.php\n"
	out += " */\n\n"
	out += "defined('_JEXEC') or die('Restricted access');\n\n"

	return out;
}

function createClass(name, body) {

	var cls = "";

	cls += "class " + name + "\n";
	cls += "{\n";
	cls += body;
	cls += "}";

	return cls;
}

function createStringDeclaration(prop, val) {

	if (val==null) val = "";

	return "\tpublic $" + prop + " = \"" + val + "\";\n\n";
}

function createArrayDeclaration(prop, array) {

	if (array===undefined || array.length < 1) return "";

	var arr = "";

	arr += "\tpublic $" + prop + " = array(" + "\n";

	for (key in array) {
		arr += "\t\t\"" + key + "\" => \"" + array[key] + "\",\n";
	}

	arr = arr.substring(0, arr.lastIndexOf(",\n")) + "\n";

	arr += "\t);\n\n";

	return arr;
}

function createFunction(prop, val) {

	var func = "";
	func += "\tpublic function " + prop + "() {\n";
	func += "\t\treturn \"" + val + "\";\n";
	func += "\t}\n\n";

	return func;
}

function convert(locale) {

	var settings = jQuery.timeago.settings.strings;

	var out = "";

	for (key in settings) {

		var val = settings[key];

		if (/prefixAgo|prefixFromNow|suffixAgo|suffixFromNow/.test(key)) {
			out += createStringDeclaration(key, val);
			continue;
		}

		if (/numbers/.test(key)) {
			out += createArrayDeclaration(key, val);
			continue;
		}

		out += createFunction(key, val);
	}

	// Make it classname safe
	var classnameSuffix = locale.replace('-','_');

	out = createHeader() + createClass("SocialDateElapsed_" + classnameSuffix + " extends SocialDateElapsed", out);

	return out;
}

// Ensure this is global
var $, jQuery;

// Load list of locales to convert
// Can't use JSON.parse because we want comments
eval("locales = " + fs.readFileSync("map.json").toString());

for (key in locales) {

	// Reset object container
	$ = jQuery = { extend: function(obj1, obj2) { $.timeago.settings.strings = obj2; }, timeago: { settings: {} } };

	var locale = locales[key] || key,
		in_file = "jquery.timeago." + key + ".js",
		out_file = "php/" + locale + ".php";

	// Parse script
	eval(fs.readFileSync(in_file).toString());

	var out = convert(locale);

	fs.writeFileSync(out_file, out);
}
