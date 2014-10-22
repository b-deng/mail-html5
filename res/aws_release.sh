#!/bin/sh

# go to root
cd `dirname $0`
cd ..

# switch branch
git checkout aws-dist
git merge master --no-edit

# build and test
rm -rf node_modules/
npm cache clear
npm install
npm test

# install only production dependencies
rm -rf node_modules/
npm install --production

# delete .gitignore files before adding to git for aws deployment
find node_modules/ -name ".gitignore" -exec rm -rf {} \;

# Add runtime dependencies to git
sed -i "" '/dist/d' .gitignore
sed -i "" '/node_modules/d' .gitignore
git add .gitignore node_modules/ dist/
git commit -m "Update aws-dist"

# push to aws
git aws.push

# switch back to master branch
git checkout master