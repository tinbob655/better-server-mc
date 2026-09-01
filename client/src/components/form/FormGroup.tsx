import React, {useId} from 'react';

type FormValue = string | boolean | FileList | null;

interface FormGroupParams<T>
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
    label: string;
    name: keyof T & string;
    formState: T;
    setFormState: React.Dispatch<React.SetStateAction<T>>;
}

export default function FormGroup<T>({
                                         label, id, name, formState, setFormState, type, ...inputProps
                                     }: FormGroupParams<T>): React.ReactElement {

    const generatedId = useId();
    const inputId = id ?? generatedId;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const {value, checked, files} = e.target;
        const newValue: FormValue = type === 'checkbox' ? checked : type === 'file' ? files : value;

        setFormState(prev => ({
            ...prev,
            [name]: newValue as T[keyof T]
        }));
    }

    const valueProps =
        type === 'checkbox' ? {checked: Boolean(formState[name])} :
            type === 'file'     ? {} :
                {value: (formState[name] as string) ?? ''};

    return (
        <div className={"formGroup"} style={{marginBottom: '2rem'}}>
            <label htmlFor={inputId} style={{marginBottom: '7px'}}>
                {label}
            </label>
            <input
                id={inputId}
                name={name}
                type={type}
                onChange={handleChange}
                {...valueProps}
                {...inputProps}
            />
        </div>
    )
}