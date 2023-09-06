#!/bin/bash

cd ..

zip -r app.zip . -x "node_modules/*" -x "dist/*"