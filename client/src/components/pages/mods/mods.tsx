import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import AnchorList from '../../multiPageComponents/anchorList';
import FancyButton from '../../multiPageComponents/fancyButton';
import { useAuth } from '../../../context/AuthContext';
import type {profile} from './profile';


export default function Mods():React.ReactElement {

    const {loggedIn} = useAuth();

    //a function to return a series of Profile components from a list of profiles
    function getProfiles():React.ReactElement[] {
        let tempProfilesHTML:React.ReactElement[] = [];
        const profileData:profile[] = [
            {
                name: "Optimised",
                pros: [
                    "Works on any computer which can run Minecraft",
                    "Increases performance massively",
                    "Lightweight",
                ],
                cons: [
                    "Does not enhance anything beyond performance"
                ],
            },
            {
                name: "Enhanced",
                pros: [
                    "Increases performance as much as 'Optimised'",
                    "Adds QOL features such as minimap and zoom to the game",
                ],
                cons: [
                    "Not as lightweight as 'Optimised'",
                    "May not run as well as optimised on really slow hardware",
                ]
            },
            {
                name: "Beautiful",
                pros: [
                    "Will provide the best possible graphical experience your hardware can give",
                    "A much more immersive gameplay experience",
                ],
                cons: [
                    "Will not run well on a low-end GPU",
                    "Will give quality at the expense of frames",
                ],
            },
        ];
        console.log(profileData);
        return tempProfilesHTML;
    };

    return (
        <React.Fragment>
            <PageHeader title="Mods" subtitle="All the mod-related information for our server" />


            {/*cut to the chance (scrolls to profiles section)*/}
            <div className="card card-left">
                <h2 className="alignLeft">
                    CUT TO THE CHASE
                </h2>
                <button type="button" onClick={() => {document.getElementById('profilesSection')?.scrollIntoView({
                    block: "center", behavior: "smooth"
                    })}}>
                    <h3>
                        Click here to scroll down straight to pre-made, downloadable profiles for you to play on!
                    </h3>
                </button>
            </div>


            {/*performance*/}
            <div className="card card-right">
                <h2 className="alignRight">
                    Performance mods
                </h2>
                <p className="alignRight">
                    We understand that the performance of your game is vital to your enjoyment; that's why we have made a comprehensive guide to squeezing as many frames our of your PC as possible.
                    <br/>
                    The first step is to locate your mods folder. On windows, this is located at the following directory by default:
                    {' '}
                    <u>
                        C:/Users/{'<USERNAME>'}/AppData/Roaming/.minecraft/mods
                    </u>
                    <br/>
                    After you have found this directory, we recommend adding the following mods:
                </p>
                <br/>

                <AnchorList left={false} elements={[
                    ['SODIUM (vital) - Changes how the game is rendered to massively increase FPS', 'https://modrinth.com/mod/sodium'],
                    ['Lithium - Reduces CPU load', 'https://modrinth.com/mod/lithium'],
                    ['Cubes Without Borders - Allows the game to run in a borderless window to increase FPS', 'https://modrinth.com/mod/cubes-without-borders'],
                    ['Entity Culling - Optimises entity rendering', 'https://modrinth.com/mod/entityculling'],
                    ['BadOptimizations - Optimises backend elements of the game', 'https://modrinth.com/mod/badoptimizations'],
                    ['FerriteCore - Reduces memory used by the game', 'https://modrinth.com/mod/ferrite-core'],
                ]} />

                <br/>
                <p className="alignRight">
                    Once your have all of these mods installed, you can expect your frames to go up by 2x - 10x!
                </p>
            </div>


            {/*mods we support*/}
            <div className="card card-left">
                <h2 className="alignLeft">
                    Supported mods
                </h2>
                <p className="alignLeft">
                    We support certain mods on the server. This means that for some select mods, their server-side capability is enabled so long as you install them on your device as well. These mods are:
                </p>
                <br/>

                <AnchorList left={true} elements={[
                    ['Distant horizons - Allows you to increase your render distance to up to 256 chunks at minimal performance cost', 'https://modrinth.com/mod/distanthorizons'],
                    ['Jade - Gives helpful information on what you are looking at', 'https://modrinth.com/mod/jade'],
                    ['JEI (Just enough items) - A complete catalogue of all items and recipes in the game', 'https://modrinth.com/mod/jei'],
                ]} />
            </div>


            {/*mods we recommend*/}
            <div className="card card-right">
                <h2 className="alignRight">
                    Recommended mods
                </h2>
                <p className="alignRight">
                    Finally, there are some mods which we think massively increase the quality of the game, this ranges from minimaps all the way to an inbuilt spyglass! Such mods include:
                </p>
                <br/>

                <AnchorList left={false} elements={[
                    ['AppleSkin - Shows how much hunger each food item will fulfil', 'https://modrinth.com/mod/appleskin'],
                    ['BetterF3 - Allows you to customise your F3 screen and remove clutter', 'https://modrinth.com/mod/betterf3'],
                    ['Continuity - Adds connected glass (among other) textures to the game', 'https://modrinth.com/mod/continuity'],
                    ['CraftPresence - Integrates a rich discord presence to minecraft', 'https://modrinth.com/mod/craftpresence'],
                    ["Just Zoom - Press 'c' to zoom in", 'https://modrinth.com/mod/just-zoom'],
                    ['Litematica - Allows the placing of holographic builds from other worlds so you can copy them', 'https://modrinth.com/mod/litematica'],
                    ['Shulker Box Tooltip - See inside shulker boxes without leaving the inventory menu', 'https://modrinth.com/mod/shulkerboxtooltip'],
                    ["Xaero's Minimap - Adds a minimap to the top-left of the screen", 'https://modrinth.com/mod/xaeros-minimap'],
                    ["Xaero's World Map - Press 'm' to open a map of the world as you have explored it", 'https://modrinth.com/mod/xaeros-world-map'],
                ]} />
                
                <br/>
                <p className="alignRight">
                    Please note that a combination of Litematica and Xero's World Map will require you to rebind the 'Open world map' keybind to avoid conflicts.
                </p>
            </div>


            {/*profiles section*/}
            <div className="card card-left" id="profilesSection">
                <h2 className="alignLeft">
                    Profiles
                </h2>
                {loggedIn ? (
                    <React.Fragment>

                        {/*the user is logged in, show them the profiles*/}
                        <p className="alignLeft fancy">
                            Below you will find a series of ready-made profiles for all players of the better server to download and enjoy!
                        </p>
                        {getProfiles()}
                    </React.Fragment>
                ) : (
                    <React.Fragment>

                        {/*the user is not logged in, they are not allowed to be shown the profiles*/}
                        <p className="alignLeft fancy">
                            You don't have permission to access our cater-made profiles because you are not yet logged in!
                        </p>
                        <FancyButton text="Click here to fix that!" transformOrigin='left' />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};