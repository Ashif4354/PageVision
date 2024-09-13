import { useState } from 'react'

import './App.css'
import { submitToServer } from './submit'

import rightArrow from './assets/right-arrow.png'


function App() {
    const [prompt, setPrompt] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [output, setOutput] = useState('')

    const onSubmit = () => {
        setSubmitted(true)
        // setTimeout(() => setOutput('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget dolor arcu. Phasellus at mi lobortis, tempus ante sed, bibendum libero. Nunc tortor massa, volutpat a urna non, ultrices tincidunt lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed nec felis non dui semper ultricies vitae quis lorem. Ut nisi leo, sagittis id consequat a, tincidunt at orci. Etiam tincidunt enim id tortor mattis pharetra. Nulla maximus nulla quam, sed finibus orci porta quis. Vivamus auctor ut ipsum feugiat egestas.Vestibulum sit amet elit at arcu fringilla viverra sit amet sed nunc. Cras nisl mauris, luctus sit amet nisi vel, tempus mollis erat. Pellentesque ac risus vulputate, porttitor elit ac, sollicitudin orci. Phasellus suscipit nibh est. Praesent pretium leo dui, cursus consequat ligula ornare eget. Morbi varius in enim vitae malesuada. Phasellus ac dui eget felis varius scelerisque ut dignissim justo. Mauris dapibus viverra lobortis. Fusce ultricies maximus vestibulum. Fusce rhoncus feugiat felis in mollis. Maecenas vel convallis lacus. Proin molestie magna quis massa maximus tempus. Nulla et varius turpis.'), 1000)
        // setOutput('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget dolor arcu. Phasellus at mi lobortis, tempus ante sed, bibendum libero. Nunc tortor massa, volutpat a urna non, ultrices tincidunt lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed nec felis non dui semper ultricies vitae quis lorem. Ut nisi leo, sagittis id consequat a, tincidunt at orci. Etiam tincidunt enim id tortor mattis pharetra. Nulla maximus nulla quam, sed finibus orci porta quis. Vivamus auctor ut ipsum feugiat egestas.Vestibulum sit amet elit at arcu fringilla viverra sit amet sed nunc. Cras nisl mauris, luctus sit amet nisi vel, tempus mollis erat. Pellentesque ac risus vulputate, porttitor elit ac, sollicitudin orci. Phasellus suscipit nibh est. Praesent pretium leo dui, cursus consequat ligula ornare eget. Morbi varius in enim vitae malesuada. Phasellus ac dui eget felis varius scelerisque ut dignissim justo. Mauris dapibus viverra lobortis. Fusce ultricies maximus vestibulum. Fusce rhoncus feugiat felis in mollis. Maecenas vel convallis lacus. Proin molestie magna quis massa maximus tempus. Nulla et varius turpis.')
        submitToServer(prompt, setOutput)
    }


    return (
        <div className='main-container'>
            <header className='heading-container'>
                <h2 className='heading-text'>PageVision</h2>
            </header>
            <div className='content-container'>
                <div className="input-container">
                    <input
                        type='text'
                        className='input-box'
                        placeholder='Enter your prompt'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    // rows={7}

                    />
                    <button className='submit-button' onClick={onSubmit}><img className='right-arrow' src={rightArrow} alt='enter-btn' /></button>
                </div>
                <div className='output-container'>
                    {submitted ? (
                        output === '' ? <p className='output-loading-text'>Output loading...</p> : <p className='output-text'>{output}</p>
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
