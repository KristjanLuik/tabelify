import React, { useState } from 'react';
import { GiArtificialIntelligence } from "react-icons/gi";
import BGRMProcessor from "../BGRMProcessor/BGRMProcessor.tsx"; // assuming the CSS is in a file named BottomMenu.css

import './BottomMenu.css';

const BottomMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleIconClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="bottomIcon" onClick={handleIconClick}>
                <span role="img" aria-label="waving hand" className={`wave ${isOpen ? 'open' : ''}`}>👋</span>
                <GiArtificialIntelligence size={40}/>
            </div>
            <div className={`menu ${isOpen ? 'open' : ''}`}>
            <p>Menu</p>
                <BGRMProcessor />
            </div>
        </>
    );
};

export default BottomMenu;