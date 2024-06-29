export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#FF5C8D] shadow-sm focus:ring-[#FF5C8D] ' +
                className
            }
        />
    );
}
