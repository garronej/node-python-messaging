#!/bin/bash
mkdir -p ./out/virtual 
virtualenv ./out/virtual
. ./out/virtual/bin/activate
pip install -r requirements.txt