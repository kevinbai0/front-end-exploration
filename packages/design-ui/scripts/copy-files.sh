#!/bin/bash

if [ -d src/design-system ]; then
    # Take action if $DIR exists. #
    cp -R design-system/src src/design-system/src
    cp design-system/index.ts src/design-system/index.ts
else
    ###  Control will jump here if $DIR does NOT exists ###
    mkdir src/design-system
    cp -R design-system/src src/design-system/src
    cp design-system/index.ts src/design-system/index.ts
fi
