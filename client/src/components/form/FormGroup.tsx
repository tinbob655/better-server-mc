import React, {useId} from 'react';
import type {FormValue} from "../../types/form";

type SharedInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'id'>;

interface FormGroupBaseParams extends SharedInputProps {
    label: string;
    id?: string;
}

// mode 1: field is one property of a larger state object,
// e.g. const [formData, setFormData] = useState({username: '', password: ''})
interface FormGroupObjectParams<T> extends FormGroupBaseParams {
    name: keyof T & string;
    formState: T;
    setFormState: React.Dispatch<React.SetStateAction<T>>;
    value?: never;
    setValue?: never;
}

// mode 2: field is its own standalone piece of state,
// e.g. const [age, setAge] = useState(10)
interface FormGroupValueParams<V extends FormValue = FormValue> extends FormGroupBaseParams {
    name?: string;
    value: V;
    setValue: React.Dispatch<React.SetStateAction<V>>;
    formState?: never;
    setFormState?: never;
}

type FormGroupParams<T, V extends FormValue = FormValue> = FormGroupObjectParams<T> | FormGroupValueParams<V>;

// tells TypeScript (and us) which branch of the union we're in, based on
// which pair of state props was actually passed in
function isObjectMode<T, V extends FormValue>(props: FormGroupParams<T, V>): props is FormGroupObjectParams<T> {
    return props.setFormState !== undefined;
}

export default function FormGroup<T = never, V extends FormValue = FormValue>(
    props: FormGroupParams<T, V>
): React.ReactElement {
    // formState/setFormState/value/setValue are destructured here purely so they
    // don't get spread onto the DOM <input> below as invalid HTML attributes.
    // The underscore prefix signals "intentionally unused" — the real reads
    // happen through `props.x` further down, after isObjectMode() has narrowed it.
    const {
        label, id, type, name,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formState: _formState, setFormState: _setFormState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        value: _value, setValue: _setValue,
        ...inputProps
    } = props;

    const generatedId = useId();
    const inputId = id ?? generatedId;

    const currentValue: FormValue = isObjectMode(props)
        ? (props.formState[props.name] as unknown as FormValue)
        : props.value;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const {value: rawValue, checked, files} = e.target;

        const newValue: FormValue =
            type === 'checkbox' ? checked :
                type === 'file' ? files :
                    type === 'number' ? (rawValue === '' ? '' : Number(rawValue)) :
                        rawValue;

        if (isObjectMode(props)) {
            props.setFormState(prev => ({
                ...prev,
                [props.name]: newValue as T[keyof T]
            }));
        } else {
            // trusts that `type` matches whatever V actually is (number/string/etc.) —
            // the same kind of boundary cast the object-mode branch above already makes
            props.setValue(newValue as V);
        }
    }

    const valueProps =
        type === 'checkbox' ? {checked: Boolean(currentValue)} :
            type === 'file'     ? {} :
                {value: (currentValue ?? '') as string | number};

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