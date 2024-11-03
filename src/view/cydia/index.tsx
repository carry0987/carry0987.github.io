import { Fragment } from 'preact';

// Import the images
import cydiaImage from '@/assets/cydia/Cydia.svg';

// Import the CSS file
import style from './style.module.scss';

export const Cydia = () => {
    return (
        <Fragment>
            <div className={`${style.fullpage} bg-[#0f1a20]`}>
                <img src={cydiaImage} alt="carry0987-cydia-repo" className="w-[180px]" />
                <div className={`${style.anim}`}>
                    <h3 className="text-white text-2xl mb-2 mt-4">carry0987</h3>
                    <p className="text-white mb-4">An open source Cydia repository.</p>
                    <a href="cydia://url/https://cydia.saurik.com/api/share#?source=https://carry0987.github.io/cydia/" className={`${style.btn} ${style['btn-default']}`}>Install</a>
                    <a href="https://github.com/carry0987/" className={`${style.btn} ${style['btn-default']} ml-4`}>GitHub</a>
                </div>
            </div>
        </Fragment>
    );
};
