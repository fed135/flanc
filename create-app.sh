#!/bin/sh

# Check parameters

APP_NAME=$1
APP_DIR=$PWD

echo "Create new FLANC app \"$APP_NAME\" in folder $APP_DIR ?"
read -n 1 -p "(Y/N)" input

echo "\n\r";

if [ "$input" != "Y" ] && [ "$input" != "y" ]; then
  echo "Exiting"
  exit 0;
fi

# Copying files
echo "Copying files..."

mkdir -p "$APP_DIR/$APP_NAME/bundle"
cd "$APP_DIR/$APP_NAME/bundle"
curl -O https://github.com/fed135/flanc/archive/refs/heads/main.zip
unzip ./main.zip

cp ./project-template/ ../

cd ../
rm -rf ./bundle

git init

yarn

