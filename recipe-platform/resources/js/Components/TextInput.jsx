import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-#FFC0D3 focus:border-#FF5C8D focus:ring-#FF5C8D rounded-md shadow-sm bg-#FDEFF4 text-#524A4E ' +
                className
            }
            ref={input}
            style={{ borderColor: '#FFC0D3', backgroundColor: '#FDEFF4', color: '#524A4E' }}
        />
    );
});
