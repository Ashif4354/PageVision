// Only this component of the extension is AI generated.
// This file contains the settings dialog for configuring the model source and other settings.
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';

const Settings = ({ open, setOpen }) => {
    const [mode, setMode] = useState('ollama');
    const [ollamaHost, setOllamaHost] = useState('');
    const [ollamaModel, setOllamaModel] = useState('');
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [googleModel, setGoogleModel] = useState('');

    const [isSaved, setIsSaved] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [checkingHost, setCheckingHost] = useState(false);
    const [hostError, setHostError] = useState('');
    const [models, setModels] = useState([]);
    const [hostVerified, setHostVerified] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('PageVisionSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setMode(parsed.mode || 'ollama');
            setOllamaHost(parsed.ollamaHost || '');
            setOllamaModel(parsed.ollamaModel || '');
            setGoogleApiKey(parsed.googleApiKey || '');
            setGoogleModel(parsed.googleModel || '');
            setIsSaved(true);
            setIsDisabled(true);

            if (parsed.mode === 'ollama' && parsed.ollamaHost) {
                checkOllamaHost(parsed.ollamaHost, true);
            }
        }
    }, []);

    const checkOllamaHost = async (host = ollamaHost, skipSet = false) => {
        setCheckingHost(true);
        setHostError('');
        try {
            const res = await fetch(`${host}/api/tags`);
            if (!res.ok) throw new Error('Bad response');
            const data = await res.json();
            const modelNames = data.models?.map(m => m.name) || [];
            if (modelNames.length === 0) throw new Error('No models found');
            setModels(modelNames);
            setHostVerified(true);
            if (!skipSet && !ollamaModel && modelNames.length > 0) {
                setOllamaModel(modelNames[0]);
            }
        } catch (err) {
            setHostError('Failed to connect to host or no models found.');
            setHostVerified(false);
        } finally {
            setCheckingHost(false);
        }
    };

    const handleSave = () => {
        setValidationError('');

        if (mode === 'ollama') {
            if (!hostVerified || !ollamaModel) {
                setValidationError('Please verify the Ollama host and select a model.');
                return;
            }
        } else if (mode === 'google') {
            if (!googleApiKey.trim() || !googleModel) {
                setValidationError('Please enter your Google API key and select a model.');
                return;
            }
        }

        const settingsToSave = {
            mode,
            ollamaHost,
            ollamaModel,
            googleApiKey,
            googleModel,
        };
        localStorage.setItem('PageVisionSettings', JSON.stringify(settingsToSave));
        setIsSaved(true);
        setIsDisabled(true);
    };

    const handleEdit = () => {
        setIsSaved(false);
        setIsDisabled(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle className='dialog-title'>Settings</DialogTitle>
            <DialogContent>
                <DialogContentText>Select your model source.</DialogContentText>

                <FormControl fullWidth margin="normal" disabled={isDisabled}>
                    <FormLabel>Model Source</FormLabel>
                    <RadioGroup
                        row
                        value={mode}
                        onChange={(e) => {
                            setMode(e.target.value);
                            setHostVerified(false);
                            setHostError('');
                            setValidationError('');
                        }}
                    >
                        <FormControlLabel value="ollama" control={<Radio />} label="Ollama (Self-hosted)" />
                        <FormControlLabel value="google" control={<Radio />} label="Google API" />
                    </RadioGroup>
                </FormControl>

                {mode === 'ollama' && (
                    <>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ollama Host Address"
                            value={ollamaHost}
                            onChange={(e) => {
                                setOllamaHost(e.target.value);
                                setHostVerified(false);
                                setHostError('');
                            }}
                            disabled={isDisabled || checkingHost}
                        />
                        {!hostVerified && !isDisabled && (
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => checkOllamaHost()}
                                disabled={checkingHost || !ollamaHost}
                            >
                                {checkingHost ? <CircularProgress size={20} /> : 'Verify Host'}
                            </Button>
                        )}
                        {hostError && <Alert severity="error" sx={{ mt: 1 }}>{hostError}</Alert>}
                        {hostVerified && (
                            <FormControl fullWidth margin="normal" disabled={isDisabled}>
                                <FormLabel>Select Ollama Model</FormLabel>
                                <Select
                                    value={ollamaModel}
                                    onChange={(e) => setOllamaModel(e.target.value)}
                                >
                                    {models.map((model) => (
                                        <MenuItem key={model} value={model}>
                                            {model}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </>
                )}

                {mode === 'google' && (
                    <>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Google API Key"
                            value={googleApiKey}
                            onChange={(e) => setGoogleApiKey(e.target.value)}
                            disabled={isDisabled}
                        />
                        {googleApiKey.trim() && (
                            <FormControl fullWidth margin="normal" disabled={isDisabled}>
                                <FormLabel>Select Google Model</FormLabel>
                                <Select
                                    value={googleModel}
                                    onChange={(e) => setGoogleModel(e.target.value)}
                                >
                                    <MenuItem value="gemma-3-12b-it">Gemma 3 12B</MenuItem>
                                    <MenuItem value="gemma-3-27b-it">Gemma 3 27B</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </>
                )}

                {validationError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {validationError}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={isSaved ? handleEdit : handleSave}
                    disabled={
                        (mode === 'ollama' && !hostVerified) ||
                        (mode === 'google' && (!googleApiKey.trim() || !googleModel))
                    }
                >
                    {isSaved ? 'Edit' : 'Save'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default Settings;


