const paddingBarStyle: React.CSSProperties = {
    backgroundColor: 'lightgray',
    height: '3px',
    paddingLeft: '5px',
    paddingRight: '5px',
    borderRadius: '5px',
    border: '5px'
};

const smallPaddingBarStyle: React.CSSProperties = {
    backgroundColor: 'lightgray',
    height: '2px',
    borderRadius: '3px',
    border: '3px'
};

const thinPaddingBarStyle: React.CSSProperties = {
    backgroundColor: 'lightgray',
    height: '1px',
    borderRadius: '2px',
    border: '2px'
};

export function ThinPaddingBar() {
    return <div style={{ ...thinPaddingBarStyle }}></div>;
}

export function SmallPaddingBar() {
    return <div style={{ ...smallPaddingBarStyle }}></div>;
}

export function PaddingBar() {
    return <div style={{ ...paddingBarStyle }}></div>;
}
