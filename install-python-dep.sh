#!/bin/bash
mkdir -p ./dist/virtual 
virtualenv -p $(which python2 || which python) ./dist/virtual
. ./dist/virtual/bin/activate
./dist/virtual/bin/python ./dist/virtual/bin/pip install -r ./requirements.txt