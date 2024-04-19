import { useState, useEffect } from 'react';

import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaDownload } from "react-icons/fa6";

import './CanvasSnapshot.css';

function CanvasSnapshot() {
    const [snapshot, setSnapshot] = useState(null);

    const takeSnapshot = () => {
        const canvas = document.getElementById('mainScene') as HTMLCanvasElement;
        if (canvas) {
            const dataUrl = canvas.toDataURL();
            // @ts-expect-error yes
            setSnapshot(dataUrl);
            document.body.classList.add('no-scroll');
        }
    };

    const closeSnapshot = () => {
        setSnapshot(null);
        document.body.classList.remove('no-scroll');
    };

    const downloadSnapshot = () => {
        const link = document.createElement('a');
        if (!snapshot) return;
        link.href = snapshot;
        link.download = 'snapshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            if (event.key === 'Escape') {
                closeSnapshot();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="CanvasSnapshot">
            <button onClick={takeSnapshot}>Take Snapshot</button>
            {snapshot && (
                <div className="Overlay">
                    <div className="Close" onClick={closeSnapshot}><AiOutlineCloseCircle/></div>
                    <div className="ImageContainer">
                        <div className="Download" onClick={downloadSnapshot}><FaDownload/></div>
                        <img src={snapshot} alt="Canvas Snapshot" style={{maxWidth: '90%', maxHeight: '90%'}}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CanvasSnapshot;