import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';

export default function Home():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title="Better Server MC" subtitle="A Better Minecraft Server" />

            {/*welcome & description section*/}

            <h2 className="alignLeft">
                Welcome on in...
            </h2>
            <p className="alignLeft" style={{maxWidth: '66%'}}>
                Eiusmod fugiat nostrud laborum occaecat ut.Dolore ullamco velit id cillum.Anim quis voluptate irure qui quis mollit incididunt quis irure eiusmod ex.Do do fugiat officia esse qui aliqua labore irure magna.Eu laboris aliquip officia duis ipsum ex ullamco ea in voluptate laborum.Esse culpa elit proident proident consequat esse excepteur aute proident sit exercitation aliqua.Incididunt ad laboris sunt ad pariatur laboris dolore nulla pariatur excepteur reprehenderit.Deserunt id aliquip nulla tempor Lorem cupidatat culpa elit esse voluptate sint.
            </p>

            <div className="dividerLine"></div>

            {/*server status section*/}
            <h2 className="alignRight">
                Server Status
            </h2>
            <p className="alignRight">
                Based on our current data, the server appears to be online.
                <br/><br/>
                0 Players have reported an outage in the last hour.
                <br/><br/>
                There are currently 0 players online.
            </p>
            <button type="button">
                <h3>
                    Having an issue? Report it here
                </h3>
            </button>

            <div className="dividerLine"></div>
        </React.Fragment>
    );
};