#!/bin/bash

# Install missing eslint dependencies
for file in *; do
pushd $file
npm install --save-dev eslint-config-prettier eslint-plugin-prettier prettier eslint;
popd
done;

# Fix audit errors
for file in *; do
pushd $file
npm install && npm audit fix
popd
done;

# List outdated packages
for file in *; do
pushd $file
npm outdated
popd
done;

# Update packages
for file in *; do
pushd $file
npm update
popd
done;

# Audit packages
for file in *; do
pushd $file
npm audit
popd
done;

# Recreate package-lock
for file in *; do
pushd $file
[ -f package.json ] && rm -rf package-lock.json && rm -rf node_modules && npm install
popd
done;

for file in *; do
pushd $file
rm -rf package-lock.json && rm -rf node_modules
popd
done;