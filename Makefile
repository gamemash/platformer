default:
	browserify main.js -o public/js/bundle.js

publish:
	git subtree push --prefix public origin gh-pages

develop:
	budo main.js:public/js/bundle.js --serve js/bundle.js --live --open --dir ./public -v