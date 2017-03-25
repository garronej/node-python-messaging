#!/bin/bash
mkdir -p ./dist/virtual 
virtualenv ./dist/virtual
. ./dist/virtual/bin/activate
pip install -r requirements.txt