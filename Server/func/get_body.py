from bs4 import BeautifulSoup

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
    # return body_content if body_content else ''
