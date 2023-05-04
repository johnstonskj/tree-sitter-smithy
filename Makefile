SRC_DIR := src
TST_DIR := test

CLI := tree-sitter
CMD_GENERATE := generate --log --no-bindings
CMD_TEST := test
#TST_DEBUG := -dD0 --filter "Integer, Ranged"

all: test

test : clean_tests $(SRC_DIR)/grammar.json
	$(CLI) $(CMD_TEST) $(TST_DEBUG)

clean_tests:
	rm -f $(TST_DIR)/corpus/*.txt\~ $(TST_DIR)/corpus/.*.\~undo-tree\~ && \
    rm -f $(TST_DIR)/highlight/*.smithy~ $(TST_DIR)/highlight/.*.\~undo-tree\~

playground: wasm test
	$(CLI) playground

wasm : $(SRC_DIR)/grammar.json
	$(CLI) build-wasm

$(SRC_DIR)/grammar.json : grammar.js
	$(CLI) $(CMD_GENERATE)
