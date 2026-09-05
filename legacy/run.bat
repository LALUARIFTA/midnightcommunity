@echo off
echo Mengaktifkan server lokal di port 8080...
echo Buka http://localhost:8080 di browser Anda.
start http://localhost:8080
python -m http.server 8080
pause
