import generatePrompt from "./generatePrompt";

const submitToServer = (prompt, setOutput) => {

    const settings = JSON.parse(localStorage.getItem('PageVisionSettings'));
    // console.log("Settings:", settings);
    
    //get html of current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            "action": "getTextContent"
        }, (response) => {

            const data = {
                prompt: prompt,
                text: response.text,
            }

            generate(data);

        });
    })


    const generate = (data) => {
        const finalPrompt = generatePrompt(data.prompt, data.text);
        // console.log("Final Prompt:", finalPrompt);

        if (settings.mode === 'ollama') {

            const data = {
                prompt: finalPrompt,
                model: settings.ollamaModel,
                stream: false
            }

            console.log("Data to send:", data);

            const url = settings.ollamaHost + '/api/generate';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data),

            };
            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    if (data.done) {
                        setOutput(trimOutput(data.response));
                    } else {
                        setOutput("Generation failed.");
                    }
                }).catch(error => {
                    console.error('Error:', error);
                    setOutput("Error: " + error);
                });

        } else if (settings.mode === 'google') {

            const data = {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: finalPrompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'text/plain',
                }
            }

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.googleModel}:generateContent?key=${settings.googleApiKey}`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data),

            };
            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    const result = data.candidates[0].content.parts[0].text;
                    setOutput(trimOutput(result));
                }).catch(error => {
                    console.error('Error:', error);
                    setOutput("Error: " + error);
                });
        } else {
            console.log("In else")
        }

    }

    const trimOutput = (output) => {
        let trimmedOutput = output.trim();
        trimmedOutput = trimmedOutput.replace("```html", "");
        trimmedOutput = trimmedOutput.replace("```", "");

        return trimmedOutput;
    }
}

export { submitToServer };  