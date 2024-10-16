NPM := npm --cwd=$(shell find . maxdepth 2 -name frontend)

set_release = \
	find . -maxdepth 2 -name version.py -print0 | \
	xargs -0 sed -i '' "s/\(__release__ = \).*/\1$1/g"

.PHONY: install
install: dev
	$(NPM) install
	pip install -e .

.PHONY: upgrade
upgrade: dev
	$(NPM) upgrade
	pip install -e .

.PHONY: run
run: dev
	$(NPM) run start

.PHONY: build
build: release
	$(NPM) run build
	python setup.py sdist bdist_wheel

.PHONY: upload
upload: release
	python -m twine upload dist/*

.PHONY: dev
dev:
	$(call set_release,False)

.PHONY: release
release:
	$(call set_release,True)