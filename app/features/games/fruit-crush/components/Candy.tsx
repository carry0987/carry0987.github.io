import React from 'react';
import { CandyColor, CandyType } from '../types';
import { CANDY_VISUALS } from '../constants';
import { Sparkles, MoveHorizontal, MoveVertical } from 'lucide-react';

interface CandyProps {
    color: CandyColor;
    type: CandyType;
    isSelected: boolean;
    isHinted: boolean;
    shift?: number;
    style?: React.CSSProperties;
    onClick: () => void;
}

const Candy: React.FC<CandyProps> = ({ color, type, isSelected, isHinted, shift = 0, style, onClick }) => {
    if (color === CandyColor.EMPTY) {
        return <div className="w-full h-full" />;
    }

    const visual = CANDY_VISUALS[color];

    // Merge external style (hint) with gravity shift
    // Hints usually use translate, which conflicts with shift translate.
    // However, hints are disabled during gravity, so shift takes precedence or we composite.
    // For simplicity, we assume mutually exclusive or just append.
    // Actually, transforms compose by order.

    const gravityTransform = shift !== 0 ? `translateY(-${shift * 100}%)` : '';
    const transitionStyle = shift === 0 ? 'transform 300ms ease-in' : 'none';

    const combinedStyle: React.CSSProperties = {
        ...style,
        transform: `${style?.transform || ''} ${gravityTransform}`,
        transition: transitionStyle,
        zIndex: isSelected || isHinted ? 20 : 10 // Ensure moving candies are on top if needed, though usually standard z-index is fine
    };

    return (
        <div
            onClick={onClick}
            style={combinedStyle}
            className={`
        w-full h-full relative cursor-pointer
        flex items-center justify-center
        ${isSelected ? 'scale-110 z-30 brightness-110' : 'hover:scale-105 active:scale-95'}
      `}>
            <div
                className={`
        w-[85%] h-[85%] rounded-2xl 
        ${visual.bg} candy-shadow
        flex items-center justify-center
        text-2xl select-none
        border-b-4 border-black/20
        relative overflow-hidden
        ${isSelected ? `ring-4 ${visual.ring}` : ''}
        ${isHinted ? 'ring-4 ring-yellow-400 z-20 brightness-110' : ''}
        ${type === CandyType.RAINBOW_BOMB ? 'animate-pulse' : ''}
      `}>
                {/* Special Markings */}
                {type === CandyType.HORIZONTAL_STRIPED && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                        <div className="w-full h-1 bg-white shadow-sm"></div>
                        <MoveHorizontal className="absolute text-white w-6 h-6 drop-shadow-md" />
                    </div>
                )}

                {type === CandyType.VERTICAL_STRIPED && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                        <div className="h-full w-1 bg-white shadow-sm"></div>
                        <MoveVertical className="absolute text-white w-6 h-6 drop-shadow-md" />
                    </div>
                )}

                {type === CandyType.RAINBOW_BOMB && (
                    <Sparkles className="absolute text-white w-8 h-8 animate-spin-slow drop-shadow-md" />
                )}

                <span className="drop-shadow-md filter z-10">{visual.icon}</span>

                {/* Shine effect */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-[1px]"></div>

                {isHinted && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full shadow-lg animate-pulse z-30">
                        HINT
                    </div>
                )}
            </div>
        </div>
    );
};

export default Candy;
