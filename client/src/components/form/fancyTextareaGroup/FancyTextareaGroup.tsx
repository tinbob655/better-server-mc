import React, {useId} from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './fancyTextareaGroup.scss';

interface FancyTextareaGroupParams {
    label: string;
    value: string; //will be raw html
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    minHeight?: string;
}

//a list of quill features to enable
const MODULES = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['blockquote', 'link'],
        ['clean'], //clears formatting on the selected text
    ],
};

//must match MODULES above
const FORMATS = ['bold', 'italic', 'underline', 'list', 'blockquote', 'link'];

export default function FancyTextareaGroup({label, value, setValue, placeholder, minHeight}: FancyTextareaGroupParams): React.ReactElement {

    const id = useId();

    return (
        <div
            className={"formGroup fancyTextareaGroup"}
            style={{marginBottom: '2rem', '--fancyTextareaMinHeight': minHeight ?? '8rem'} as React.CSSProperties}
        >
            <label htmlFor={id} style={{marginBottom: '7px'}}>
                {label}
            </label>

            <ReactQuill
                id={id}
                theme={"snow"}
                value={value}
                onChange={setValue}
                modules={MODULES}
                formats={FORMATS}
                placeholder={placeholder}
            />
        </div>
    )
}