#!/bin/bash
mkdir -p virtual 

virtualenv virtual

. ./virtual/bin/activate

pip install -r requirements.txt
