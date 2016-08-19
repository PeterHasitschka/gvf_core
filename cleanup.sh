#!/bin/sh

 find app/ -type f -regextype posix-extended -iregex ".*\.(js|map)" -delete
