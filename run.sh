echo $(service elasticsearch start)
echo $(. venv/bin/activate && cd webapp && export FLASK_APP=app && flask run)
echo $(cd ../ui && npm start)