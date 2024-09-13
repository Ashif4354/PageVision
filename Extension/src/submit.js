
const submitToServer = (prompt, setOutput) => {
    

    //get html of current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            "action": "getHTML"
        }, (response) => {

            const data = {
                prompt: prompt,
                html: response.html,
            }

            submit(data);
            
        });

    })

    
    const submit = (data) => {
        const url = 'http://localhost:5000/ollama';
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
                setOutput(data.output);
            })
    }
}

export { submitToServer };  