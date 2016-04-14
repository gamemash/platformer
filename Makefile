default:
	browserify main.js -o public/js/bundle.js

publish:
	git subtree push --prefix public origin gh-pages
	@echo ""
	@echo "--------------------------------------------"
	@echo 'Go to: http://gamemash.github.io/platformer/'

develop:
	budo main.js:public/js/bundle.js --serve js/bundle.js --live --open --dir ./public -v

scratchpad:
	budo scratch.js:public/js/scratch.js --serve js/scratch.js --live --open --dir ./public -v