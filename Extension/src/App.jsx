import { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';

import './App.css'
import { submitToServer } from './scripts/submit'
import Settings from './Settings'
import Loading from './Components/Loading'


function App() {
    const [prompt, setPrompt] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [output, setOutput] = useState('')
    const [settingsOpen, setSettingsOpen] = useState(false)

    const onSubmit = () => {
        setSubmitted(true)
        setOutput('')
        submitToServer(prompt, setOutput)
    }

    return (
        <div className='main-container'>
            <Settings open={settingsOpen} setOpen={setSettingsOpen} />
            <header className='heading-container'>
                <h2 className='heading-text'>PageVision</h2>
                <div className="settings-icon-container">
                    <SettingsIcon
                        fontSize='large'
                        className='settings-icon'
                        sx={{
                            color: 'white',
                            '&:hover': {
                                color: 'lightgrey',
                            },
                            cursor: 'pointer',
                        }}
                        onClick={() => setSettingsOpen(true)}
                    />
                </div>
            </header>
            <div className='content-container'>
                <div className="input-container">
                    <input
                        type='text'
                        className='input-box'
                        placeholder='Enter your prompt'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}

                    />
                    <button className='submit-button' onClick={onSubmit}>
                        <SendIcon
                            fontSize='medium'
                        />
                    </button>
                </div>
                <div className='output-container'>
                    {submitted ? (
                        output === '' ? (
                            <Loading />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: output }} className='output-text' />
                        )

                    ) : (
                        <div />
                    )
                    }

                </div>
            </div>
        </div>

    )
}

export default App
