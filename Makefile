include ../../build/modules.mk

MODULE = timeago
FILENAME = ${MODULE}.js
SOURCE = jquery.${MODULE}.js
PRODUCTION = ${PRODUCTION_DIR}/${FILENAME}
DEVELOPMENT = ${DEVELOPMENT_DIR}/${FILENAME}

all:
	${MODULARIZE} -jq -n "${MODULE}" ${SOURCE} > ${DEVELOPMENT}
	${UGLIFYJS} ${DEVELOPMENT} > ${PRODUCTION}

	mkdir -p ${PRODUCTION_DIR}/${MODULE}
	mkdir -p ${DEVELOPMENT_DIR}/${MODULE}

	for locale in locales/*.js ; do \
		echo $$locale | sed 's/locales\/jquery.timeago.//' | xargs make ; \
	done

%.js:
	${WRAP} -o jQuery locales/jquery.timeago.$*.js > ${DEVELOPMENT_DIR}/${MODULE}/$*.js
	${UGLIFYJS} ${DEVELOPMENT_DIR}/${MODULE}/$*.js > ${PRODUCTION_DIR}/${MODULE}/$*.js
