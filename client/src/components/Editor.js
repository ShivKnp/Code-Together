import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/seti.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, isFullScreen, toggleFullScreen }) => {
    const editorRef = useRef(null);
    const [theme, setTheme] = useState('seti');
    const [fontSize, setFontSize] = useState('18px');

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: theme,
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                lineWrapping: true,
            }
        );

        editorRef.current.getWrapperElement().style.fontSize = fontSize;

        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);

            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setOption('theme', theme);
        }
    }, [theme]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getWrapperElement().style.fontSize = fontSize;
        }
    }, [fontSize]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && code !== editorRef.current.getValue()) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    return (
        <div className={`relative ${isFullScreen ? 'w-full h-full' : 'p-2'}`}>
            <div style={{ marginBottom: '10px' }}
                className={`flex items-center space-x-8 z-10 ${isFullScreen ? 'w-auto' : 'w-full'}`}
            >
                {!isFullScreen && (
                    <>
                        <div className="flex items-center">
                            <label 
                                htmlFor="theme-select" 
                                className="text-white text-xs mr-1"
                            >
                                Theme:
                            </label>
                            <select
                                id="theme-select"
                                onChange={handleThemeChange}
                                value={theme}
                                className="p-1 bg-gray-800 text-white border border-gray-600 rounded text-xs"
                            >
                                <option value="dracula">Dracula</option>
                                <option value="material">Material</option>
                                <option value="eclipse">Eclipse</option>
                                <option value="solarized light">Solarized Light</option>
                                <option value="solarized dark">Solarized Dark</option>
                                <option value="cobalt">Cobalt</option>
                                <option value="monokai">Monokai</option>
                                <option value="seti">Seti</option>
                                <option value="rubyblue">RubyBlue</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label 
                                htmlFor="font-size-select" 
                                className="text-white text-xs mr-1"
                            >
                                Font Size:
                            </label>
                            <select
                                id="font-size-select"
                                onChange={handleFontSizeChange}
                                value={fontSize}
                                className="p-1 bg-gray-800 text-white border border-gray-600 rounded text-xs"
                            >
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                            </select>
                        </div>
                    </>
                )}

                <button
                    onClick={toggleFullScreen}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
                >
                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
            </div>

            <textarea 
                id="realtimeEditor" 
                className={`w-full h-full border rounded ${isFullScreen ? 'p-0' : 'p-2'}`} 
                style={{ paddingTop: isFullScreen ? '0' : '40px' }}
            />
        </div>
    );
};

export default Editor;
