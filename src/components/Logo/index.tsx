import {useState} from 'react';

export default function Logo() {
    const [logoText, setLogoText] = useState("(ヘ･_･)ヘ┳━┳");

    return (
        <h1 className="Logo">Tablify <span onMouseEnter={() => setLogoText("(╯°□°）╯︵ ┻━┻")}
                                           onMouseLeave={() => setLogoText("(ヘ･_･)ヘ┳━┳")}>{logoText}</span>
        </h1>
    );
}