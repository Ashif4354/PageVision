from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.wrappers import Response

from func.get_body import get_body
from func.get_content_in_file import *
from func.fetch_ollama import fetch_ollama
from func.time_it import time_it

app = Flask(__name__)
CORS(app)

@app.before_request
def before_request():
    print("\n\n")

# @app.after_request
# def after_request(arg):
#     print(arg)

@app.route('/', methods=['GET'])
def hello_world() -> Response:
    # print(jsonify({'a': 'b'}), type(jsonify({'a': 'b'})))
    return jsonify(
        {
            'status': 'ollama running',
        }
    )

@app.route('/ollama', methods=['GET', 'POST'])
@time_it
def model() -> Response:

    
    if request.method == 'GET':
        return jsonify(
            {
                'status': 'ollama ready',
            }
        )

    if request.method == 'POST':
        print("Recieved")

        write_html_file(request.json['html'])  

        content = get_body(request.json['html'])

        write_content_txt(content)

        if not content:
            return {
                'success': False,
                'error': 'Failed to extract body from html'
            }
        
        response = fetch_ollama(content, request.json['prompt'])
        
        write_output_txt(response)

        return jsonify(
            {
                'success': True,
                'output': response,
            }
        )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)