const generatePrompt = (prompt, textContent) => {
    const Prompt = `
    Prompt: ${prompt}
    Text content: ${textContent}
    Extract the requested information from the text content.
    Only provide the exact information asked in the prompt, without adding any extra text before or after the response.
    If the response would look good in a list format, respond in a ordered/unordered list format.
    If the response would look good in a table format, respond in a table format.
    The html tags SHOULD ALSO include inline CSS for styling the content or the table. 
    Adjust the CSS such that it should be for dark themed background.
    If the prompt is a question, respond with the answer to the question.
    If no match is found, respond with 'Not found'.`
    

    return Prompt;
};

export default generatePrompt;

