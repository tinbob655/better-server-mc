import React, {useRef, useState} from 'react';
import type {Color, NewPollOptionRequest, NewPollRequest} from "../../../types/poll";
import FormGroup from "../../../components/form/FormGroup.tsx";
import DropdownGroup from "../../../components/form/dropdownGroup/DropdownGroup.tsx";
import FancyButton from "../../../components/fancyButton/FancyButton.tsx";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import './newPollForm.scss';

interface NewPollFormParams {
    addPoll: (request: NewPollRequest) => Promise<void>
}

//while being edited we need an id
interface DraftPollOption extends NewPollOptionRequest {
    id: number;
}

//cycled through so a freshly-added option doesn't default to the same colour as the last one
const OPTION_COLOR_PALETTE: Color[] = ['#4a72c9', '#7fa66b', '#b3a186', '#c0605a', '#8fb2ec', '#c9ccd6'];

export default function NewPollForm({addPoll}: NewPollFormParams): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [anonymous, setAnonymous] = useState<'Yes' | 'No'>('Yes');
    const [allowMultipleResponses, setAllowMultipleResponses] = useState<'Yes' | 'No'>('No');
    const [expiry, setExpiry] = useState<string>('');

    //the first row is created with id 0 up-front, so new rows start counting from 1
    const nextOptionId = useRef<number>(1);
    const [optionDrafts, setOptionDrafts] = useState<DraftPollOption[]>([
        {id: 0, name: '', color: OPTION_COLOR_PALETTE[0]}
    ]);

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    function updateOptionName(id: number, name: string): void {
        setOptionDrafts(prev => prev.map(option => option.id === id ? {...option, name} : option));
    }

    function updateOptionColor(id: number, color: string): void {
        setOptionDrafts(prev => prev.map(option => option.id === id ? {...option, color: color as Color} : option));
    }

    function addOption(): void {
        const id = nextOptionId.current++;
        setOptionDrafts(prev => [
            ...prev,
            {id, name: '', color: OPTION_COLOR_PALETTE[prev.length % OPTION_COLOR_PALETTE.length]}
        ]);
    }

    //refuses to drop below 1 option, since a poll needs at least one to submit
    function removeOption(id: number): void {
        setOptionDrafts(prev => prev.length > 1 ? prev.filter(option => option.id !== id) : prev);
    }

    const canSubmit: boolean = title.trim().length > 0 && optionDrafts.every(option => option.name.trim().length > 0);

    function handleSubmit(): void {
        setSubmitError(null);
        setSubmitSuccess(false);

        const request: NewPollRequest = {
            title,
            anonymous: anonymous === 'Yes',
            allowMultipleResponses: allowMultipleResponses === 'Yes',

            //gets rid of the id field
            defaultOptions: optionDrafts.map(({name, color}): NewPollOptionRequest => ({name, color})),

            //convert our date & time into an instant
            expiresAt: new Date(expiry).toISOString(),
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
                    label={"Anonymous poll?"}
                    options={['Yes', 'No']}
                    option={anonymous}
                    setOption={setAnonymous as never}
                />

                {/*if the poll should allow multiple responses*/}
                <DropdownGroup
                    label={"Allow multiple responses?"}
                    options={['Yes', 'No']}
                    option={allowMultipleResponses}
                    setOption={setAllowMultipleResponses as never}
                />

                {/*poll's expiry time*/}
                <div className={"formGroup"}>
                    <label htmlFor={"pollExpiryTime"}>
                        Date & time of expiration
                    </label>
                    <input
                        id={"pollExpiryTime"}
                        name={"pollExpiryTime"}
                        type={"datetime-local"}
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        />
                </div>
            </form>

            {/*poll options*/}
            <div className={"newPollOptionsWrapper"}>
                <p className={"newPollOptionsLabel"}>Poll options</p>

                {optionDrafts.map((option, index) => (
                    <div className={"newPollOptionRow"} key={option.id}>
                        <input
                            type={"color"}
                            className={"newPollOptionColor"}
                            value={option.color}
                            onChange={e => updateOptionColor(option.id, e.target.value)}
                            aria-label={`Colour for option #${index + 1}`}
                        />

                        <input
                            type={"text"}
                            className={"newPollOptionName"}
                            placeholder={`Option #${index + 1}`}
                            value={option.name}
                            onChange={e => updateOptionName(option.id, e.target.value)}
                        />

                        <button
                            type={"button"}
                            className={"removeOptionButton"}
                            onClick={() => removeOption(option.id)}
                            disabled={optionDrafts.length <= 1}
                            aria-label={`Remove option #${index + 1}`}
                        >
                            ✖
                        </button>
                    </div>
                ))}

                <FancyButton label={"Add another option"} onClick={addOption} />
            </div>

            <FancyButton label={"Submit"} onClick={handleSubmit} disabled={!canSubmit} />
            {submitError && <p className={"errorText"}>{submitError}</p>}
            {submitSuccess && <p className={"successText"}>Poll added successfully!</p>}
        </React.Fragment>
    )
}