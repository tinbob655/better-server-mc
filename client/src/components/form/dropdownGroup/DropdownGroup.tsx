import React, {useId} from 'react';
import './dropdownGroup.scss';

interface DropdownGroupParams extends Omit<React.ComponentProps<"select">, 'value' | 'onChange' | 'id'> {
    label: string;
    options: string[];
    option: string;
    setOption: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
}

export default function DropdownGroup({label, options, option, setOption, placeholder, ...props}: DropdownGroupParams): React.ReactElement {

    const id = useId();

    return (
        <div className={"formGroup"} style={{marginBottom: '2rem'}}>
            <label htmlFor={id} style={{marginBottom: '7px'}}>
                {label}
            </label>

            <div className={"dropdownGroupWrapper"}>
                <select
                    id={id}
                    value={option}
                    onChange={e => setOption(e.target.value)}
                    {...props}
                >
                    {/*optional unselectable placeholder*/}
                    {placeholder && (
                        <option value={""} disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map(opt => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}