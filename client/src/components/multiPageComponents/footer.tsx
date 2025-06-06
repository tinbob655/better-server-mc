import React from 'react';

export default function Footer():React.ReactElement {

    return (
        <footer>
            <div id="footerWrapper">
                <table>
                    <thead>
                        <tr>
                            <td>
                                <img src='/logo.png' id="footerImage" />
                            </td>
                            <td>
                                <p className="alignLeft">
                                    All rights reserved Better-Server-MC &copy;
                                    <br/><br/>
                                    Want to get in on the action in our community? {' '}
                                    <u>
                                        <a href="https://discord.gg/tqNY4sDQ9t" target="_blank">
                                            Join the Discord to get whitelisted!
                                        </a>
                                    </u>
                                </p>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </footer>
    );
};