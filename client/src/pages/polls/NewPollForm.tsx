import React, {useState} from 'react';
import type {NewPollOptionRequest, NewPollRequest} from "../../types/poll";
import FormGroup from "../../components/form/FormGroup.tsx";
import DropdownGroup from "../../components/form/dropdownGroup/DropdownGroup.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";

interface NewPollFormParams {
    addPoll: (request: NewPollRequest) => Promise<void>
}

const DEFAULT_NEW_OPTION: NewPollOptionRequest = {
    name: '',
    color: '#ffffff',
}

export default function NewPollForm({addPoll}: NewPollFormParams): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [anonymous, setAnonymous] = useState<'Yes' | 'No'>('Yes');
    const [defaultOptions, setDefaultOptions] = useState<NewPollOptionRequest[]>([DEFAULT_NEW_OPTION]);

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    function handleSubmit(): void {
        setSubmitError(null);
        setSubmitSuccess(false);

        const request: NewPollRequest = {
            title,
            anonymous: anonymous === 'Yes',
            defaultOptions,
        }

        addPoll(request)
            .then(() => setSubmitSuccess(true))
            .catch(err => setSubmitError(parseAxiosError(err)));
    }

    return (
        <React.Fragment>
            <form className={"horizontal"} style={{marginTop: '1rem'}}>

                {/*poll title*/}
                <FormGroup
                    name={"title"}
                    value={title}
                    setValue={setTitle}
                    label={"Poll title"}
                />

                {/*if the poll should be anonymous*/}
                <DropdownGroup
                    label={"Anonymous poll"}
                    options={['Yes', 'No']}
                    option={anonymous}
                    setOption={setAnonymous as never}
                />

                {/*poll options*/}
                {defaultOptions.map((option, index) => (
                    <div>
                        <p>
                            Option #{index + 1}
                        </p>

                        <FormGroup
                            name={`option${index}Name`}
                            value={option.name}
                            setValue={(value) => setDefaultOptions(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                    ...updated[index],
                                    name: value
                                }
                                return updated;
                            })}
                            label={`Name for option #${index + 1}`}
                        />


                    </div>
                ))}
            </form>

            <FancyButton label={"Submit"} onClick={handleSubmit} />
            {submitError && <p className={"errorText"}>{submitError}</p>}
            {submitSuccess && <p className={"successText"}>Poll added successfully!</p>}
        </React.Fragment>
    )
}