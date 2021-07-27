#!/bin/sh

# Current dir helper

a="/$0"; a=${a%/*}; a=${a#/}; a=${a:-.}; BASEDIR=$(cd "$a"; pwd)

# Check parameters

APP_NAME=$1
APP_DIR=$PWD
TEMPLATE_URI=$BASEDIR

if [ "$2" != "-Y" ]; then

  echo "Create new FLANC app \"$APP_NAME\" in folder $APP_DIR ?"
  read -n 1 -p "(Y/N)" input

  echo "\n\r";

  if [ "$input" != "Y" ] && [ "$input" != "y" ]; then
    echo "Exiting"
    exit 0;
  fi
fi

# Copying files
echo "Copying files..."

if [ "$2" != "-Y" ]; then
  mkdir -p "$APP_DIR/$APP_NAME/bundle"
  cd "$APP_DIR/$APP_NAME/bundle"

  curl -O https://github.com/fed135/flanc/archive/refs/heads/main.zip
  unzip ./main.zip

  cp ./project-template/ ../

  cd ../
  rm -rf ./bundle

  git init
else
  cp -a $TEMPLATE_URI/project-template/. .
fi

# Replace tokens
echo "Replacing tokens..."

sed -i -e "s/<project_name>/$APP_NAME/g" package.json
sed -i -e "s/<project_name>/$APP_NAME/g" README.md
sed -i -e "s/<project_name>/$APP_NAME/g" packages/domain/sample/package.json
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/items/package.json
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/items/data.ts
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/items/model.ts
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/users/package.json
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/users/data.ts
sed -i -e "s/<project_name>/$APP_NAME/g" packages/resource/users/model.ts
sed -i -e "s/<project_name>/$APP_NAME/g" packages/utils/db/package.json
sed -i -e "s/<project_name>/$APP_NAME/g" test/utils/package.json

# Install
echo "Installing..."

yarn

echo "Done."
