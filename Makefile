SRC_DIR := src
TST_DIR := test/corpus

CLI := tree-sitter
CMD_GENERATE := generate --log --no-bindings
CMD_TEST := test
#TST_DEBUG := -dD0 --filter "Integer, Ranged"

all: test

test : clean_tests $(SRC_DIR)/grammar.json
	$(CLI) $(CMD_TEST) $(TST_DEBUG)

clean_tests:
	rm -f $(TST_DIR)/*.txt~

wasm : $(SRC_DIR)/grammar.json
	$(CLI) build-wasm

$(SRC_DIR)/grammar.json : grammar.js
	$(CLI) $(CMD_GENERATE)
