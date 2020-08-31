#/bin/bash

npm --prefix api i
npm --prefix client i
npm --prefix client run build
npm --prefix api run start
