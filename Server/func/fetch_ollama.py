from ollama import generate as ollama_generate
from icecream import ic

from .get_content_in_file import write_response_json

def fetch_ollama(content: str, prompt: str) -> str:
    #list all the products listed and its prices in a table format

    MODEL = (
        # 'gemma:2b' 
        # 'gemma:7b'
        # 'gemma2:2b'
        # 'gemma2:9b'
        # 'gemma2:27b'
        # 'llama3:8b'
        'llama3.1:8b'
        # 'qwen2.5:0.5b'
        # 'qwen2.5:1.5b'
        # 'qwen2.5:3b'
        # 'qwen2.5:7b'

    )

    prompt = (
        # "Extract the requested information from the following text content from an HTML document."
        "Extract the requested information from the following HTML document."
        "Only provide the exact information asked in the prompt, without adding any extra text before or after the response."
        "Respond in a list format if possible"
        "If no match is found, respond with 'Not found'."
        f"\nPrompt: {prompt}"
        f"\nText content from HTML document: {content}"
    )

    model_config = {
        'num_ctx': len(prompt),
        # 'top_k': 100
    }

    print("Prompt length: ", len(prompt))

    response = ollama_generate(prompt = prompt, model = MODEL, options = model_config)
    # response = chunked_prompt(content, prompt, MODEL, 8192)

    # print(response)
    write_response_json(response)

    if response['done']:
        return response['response']
    


def chunked_prompt(content: str, prompt: str, model: str, chunk_size: int = 1000) -> str:
    print("In chunked prompt")
    chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]

    print("Chunks generated: ", len(chunks))

    continue_prompt = "\n\nRemember, the content given to you is a part of a larger text. Please continue from where you left off in the previous response."
    
    context = []
    count = 1
    for chunk in chunks:
        response = ollama_generate(prompt = chunk + continue_prompt, model = model, context=context, keep_alive=10.0)

        context = response['context']
        print("RESPONSE {} : \n{}".format(count, response['response']))

        print("Chunk {} done".format(count))
        count += 1
    
    print("All chunks done")
    ollama_generate(prompt = prompt, model = model, context=context, keep_alive=10.0)
    print("Prompt done")
    
    return response

    

    