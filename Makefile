all: modularize-script create-script-folder locale

include ../../build/modules.mk

MODULE = timeago
SOURCE_SCRIPT_FOLDER = .

locale:
	for locale in locales/*.js ; do \
		echo $$locale | sed 's/locales\/jquery.timeago.//' | xargs make ; \
	done

%.js:
	${WRAP} -o jQuery locales/jquery.timeago.$*.js > ${TARGET_SCRIPT_FOLDER}/$*.js
	${UGLIFYJS} ${TARGET_SCRIPT_FOLDER}/$*.js > ${TARGET_SCRIPT_FOLDER}/$*.min.js
