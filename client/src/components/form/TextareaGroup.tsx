import React, {useId} from 'react';

interface TextareaGroupParams extends React.ComponentProps<"textarea"> {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextareaGroup({label, value, setValue, ...props}: TextareaGroupParams) {

    const id = useId();

    return (
        <div className={"formGroup"} style={{marginBottom: '2rem'}}>
            <label htmlFor={id} style={{marginBottom: '7px'}}>
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={e => setValue(e.target.value)}
                {...props}
            />
        </div>
    )
}