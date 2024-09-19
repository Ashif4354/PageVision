from json import dump

def write_content_txt(content: str) -> None:
    """
    Write the content to a text file.
    """
    try:
        with open('content.txt', 'wb') as f:
            f.write(content.encode('utf-8'))
    except Exception as e:
        print("Failed to write content to file", e)


def write_html_file(html: str) -> None:
    """
    Write the html to a file.
    """
    try:
        with open('output.html', 'wb') as f:
            f.write(html.encode('utf-8'))
    except Exception as e:
        print("Failed to write html to file", e)


def write_output_txt(output: str) -> None:
    """
    Write the output to a text file.
    """
    try:
        with open('output.txt', 'wb') as f:
            f.write(output.encode('utf-8'))
    except Exception as e:
        print("Failed to write output to file", e)


def write_response_json(response: dict) -> None:
    """
    Write the response to a json file.
    """
    try:
        with open('response.json', 'w') as f:
            dump(response, f)
    except Exception as e:
        print("Failed to write response to file", e)