import { Fragment } from 'preact';

// Import the images
import cydiaImage from '@/assets/cydia/Cydia.svg';

// Import the CSS file
import style from './style.module.scss';

export const Cydia = () => {
    const menu = {
        Home: './',
        Games: './games',
        Script: 'https://github.com/carry0987/UserJS'
    };

    return (
        <Fragment>
            <div className="container mx-auto p-4">
                <div className="bg-gray-800 text-white text-center flex justify-around rounded overflow-hidden">
                    {Object.entries(menu).map(([text, link], index, array) => (
                        <a
                            key={index}
                            href={link} // Use the link from the menu object
                            target={link.startsWith('http') ? '_blank' : '_self'}
                            className={`font-bold text-xl py-2 ${index !== array.length - 1 ? 'border-r border-gray-400' : ''} w-full hover:bg-blue-300 hover:text-black transition-colors duration-300`}>
                            {text} {/* Display text from the menu object */}
                        </a>
                    ))}
                </div>
            </div>
            <div className={`${style.fullpage} bg-[#0f1a20]`}>
                <img src={cydiaImage} alt="carry0987-cydia-repo" className="w-[180px]" />
                <div className={`${style.anim}`}>
                    <h3 className="text-white text-2xl mb-2 mt-4">carry0987</h3>
                    <p className="text-white mb-4">An open source Cydia repository.</p>
                    <a
                        href="cydia://url/https://cydia.saurik.com/api/share#?source=https://carry0987.github.io/cydia/"
                        className={`${style.btn} ${style['btn-default']}`}>
                        Install
                    </a>
                    <a href="https://github.com/carry0987/" className={`${style.btn} ${style['btn-default']} ml-4`}>
                        GitHub
                    </a>
                </div>
            </div>
        </Fragment>
    );
};
