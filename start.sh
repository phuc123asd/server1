#!/bin/bash

echo "Starting backend server..."
node index.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend server..."
cd client && npm run dev

kill $BACKEND_PID 2>/dev/null
