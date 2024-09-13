from flask import Flask, jsonify, request
from flask_cors import CORS
from ollama import generate as ollama_generate
import tokenize
# from langchain_community.llms import Ollama
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# llm = Ollama(model="llama3.1:8b")

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify(
        {
            'status': 'ollama running',
        }
    )

@app.route('/ollama', methods=['GET', 'POST'])
def model():
    if request.method == 'GET':
        return jsonify(
            {
                'status': 'ollama ready',
            }
        )

    if request.method == 'POST':
        print("Recieved")

        def get_body(html):
            soup = BeautifulSoup(html, 'html.parser')
            body_content = soup.body

            for script_or_style in body_content(['script', 'style']):
                script_or_style.extract()

            cleaned_text = ''

            for element in body_content:
                cleaned_text += element.get_text(separator='\n', strip=True)
            
            # cleaned_text = body_content.get_text()            
            
            return str(cleaned_text) if body_content else ''

        html = get_body(request.json['html'])

        try:
            with open('content.txt', 'wb') as f:
                f.write(html.encode('utf-8'))
        except Exception as e:
            print("Failed to write html to file", e)

        if not html:
            return {
                'success': False,
                'error': 'Failed to extract body from html'
            }

        prompt = (
            f"You are tasked with extracting specific information from the following text content: {html}. "
            "Please follow these instructions carefully: \n\n"
            f"1. **Extract Information:** Only extract the information that directly matches the provided description: {request.json['prompt']}. "
            "2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
            "3. **Empty Response:** If no information matches the description, return an empty string ('')."
            "4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."

        )

        try:
            with open('output.html', 'wb') as f:
                f.write(request.json['html'].encode('utf-8'))
        except Exception as e:
            print("Failed to write html to file", e)
        
        prompts = [
            prompt[i:i + 7000] for i in range(0, len(prompt), 7000)
        ]

        final_response = ""
           
        # for prompt in prompts:
        #     response = ollama_generate(model="llama3:8b", prompt=prompt, )
        #     final_response += response['response']

        model_config = {
            'num_ctx': len(prompt),
            # 'top_k': 100
        }
        
        print("Prompt length: ", len(prompt))
        response = ollama_generate(prompt = prompt, model="gemma:7b", options = model_config)
        # response = llm.invoke(prompt)
        print(response)
        
        # if response['done']:
        #     return jsonify(
        #         {
        #             'success': True,
        #             'output': response['response'],
        #         }
        #     )

        return jsonify(
            {
                'success': True,
                'output': response['response'],
            }
        )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)