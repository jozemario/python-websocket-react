#!/bin/sh

nginx -g 'daemon off;' &

gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 2 app.main:app