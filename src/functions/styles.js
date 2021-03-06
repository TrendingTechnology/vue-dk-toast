export const formatCssProperties = (styles, duration) => {
    if (!styles) styles = {};

    let formatted = Object.keys(styles)
        .map(style => {
            const formattedName = style
                .split('')
                .map((letter, index) => {
                    // Vendor prefixes
                    const webkit = style.split('webkit')[0] === '';
                    const moz = style.split('moz')[0] === '';
                    const ms = style.split('ms')[0] === '';

                    if (letter === '-') return letter;
                    if ((webkit || moz || ms) && index === 0) return `-${letter.toLowerCase()}`;
                    if (letter === letter.toUpperCase()) return `-${letter.toLowerCase()}`;
                    else return letter;
                })
                .join('');
            return `${formattedName}: ${styles[style]};`;
        })
        .join('');

    // Calculate -0.15s from the end of duration for animating out
    let animation = `animation: dk__toast-in 0.15s, dk__toast-in 0.15s ${duration / 1000 -
        0.15}s reverse forwards;`;

    return (formatted += animation);
};

export const appendStylesheet = options => {
    // Format style properties/values
    let properties = formatCssProperties(options.styles, options.duration);
    let oppositePositionX;

    if (options.positionX === 'left') oppositePositionX = 'right';
    else oppositePositionX = 'left';

    // Stylesheet content
    let styles = `
            .dk__toast-container {
                display: flex;
                flex-direction: column;
                position: fixed;
                ${options.positionY}: 40px;
                ${options.positionX}: 60px;
                margin-${oppositePositionX}: 60px;
                z-index: 100;
            }
            .dk__toast {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                margin: 5px 0;
                padding: 7px 45px;
                min-width: 100px;
                font: 17px Avenir, sans-serif;
                text-align: center;
                border-radius: 5px;
                background: #fff;
                box-shadow: 0 1px 3px #000;
                transition: opacity 0.25s;
                ${properties || ''}
            }
            .dk__toast:hover {
                opacity: 0.7;
            }
            .dk__toast span,
            .dk__toast i {
                position: absolute;
                right: 10px;
                padding: 5px;
                font-size: 16px;
            }
            .dk__icon-only {
                padding: 6px 0;
            }
            .dk__icon-only i,
            .dk__icon-only span {
                position: relative;
                right: unset;
            }
            @keyframes dk__toast-in {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @media only screen and (max-width: 450px) {
                .dk__toast-container {
                    right: 0;
                    left: 0;
                    ${options.positionY}: 10px;
                    margin: 0 auto;
                    width: 90%;
                }
                .dk__toast {
                    padding: 10px 30px;
                }
                .dk__icon-only {
                    flex: 1;
                    padding: 8px 30px;
                }
            }
        `;

    // Create stylesheet
    const stylesheet = document.createElement('style');

    // Set stylesheet content
    stylesheet.innerHTML = styles;

    // Append
    document.head.appendChild(stylesheet);
};
