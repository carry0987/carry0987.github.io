import { useState, useEffect } from 'react';

interface TypewriterProps {
    texts: string[];
    delay?: number;
    pause?: number;
}

export const Typewriter = ({ texts, delay = 100, pause = 2000 }: TypewriterProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(
            () => {
                const fullText = texts[currentTextIndex];

                if (isDeleting) {
                    setCurrentText(fullText.substring(0, currentText.length - 1));
                } else {
                    setCurrentText(fullText.substring(0, currentText.length + 1));
                }

                if (!isDeleting && currentText === fullText) {
                    setTimeout(() => setIsDeleting(true), pause);
                } else if (isDeleting && currentText === '') {
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                }
            },
            isDeleting ? delay / 2 : delay
        );

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, texts, delay, pause, currentTextIndex]);

    return (
        <span className="font-mono text-tech-400">
            {currentText}
            <span className="animate-blink border-r-2 border-tech-400 ml-1"></span>
        </span>
    );
};
