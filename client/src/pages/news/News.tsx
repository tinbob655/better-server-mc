import React, {lazy, Suspense, useState} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import useNews from "../../hooks/useNews.ts";
import {useAuth} from "../../context/auth/AuthContext.tsx";
import {Permission} from "../../types/permission.ts";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import SearchBar from "../../components/searchBar/SearchBar.tsx";
import useSearch from "../../hooks/useSearch.ts";

const SingleNews = lazy(() => import("./SingleNews.tsx"));
const NewNewsForm = lazy(() => import("./NewNewsForm.tsx"));

export default function News():React.ReactElement {

    const {news, fetchError, addNews, deleteNews} = useNews();
    const {search, setSearch, filteredItems} = useSearch(news, n => [n.title]);

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === Permission.DEV;

    const [addingNewNews, setAddingNewNews] = useState<boolean>(false);

    return (
        <React.Fragment>
            <PageHeader title={"News"} subtitle={"Stay informed"} />

            {/*existing news section*/}
            <GenericMarkupSection title={"What's been going on?"}>
                <p>
                   On this page you can view all of the posts the admins of the server have given out in the past so that
                    you can stay informed.
                </p>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder={"Search news..."}
                    alignment={"RIGHT"}
                />
                <div className={"sectionDivider light"} />

                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {news.length === 0 && <p className={"warningText"}>There is currently no news available.</p>}
                {news.length > 0 && filteredItems.length === 0 && <p className={"warningText"}>No items match that search.</p>}
                <Suspense>
                    {filteredItems.map(n =>
                        <SingleNews
                            key={n.title}
                            news={n}
                            deleteNews={deleteNews}
                        />
                    )}
                </Suspense>
            </GenericMarkupSection>

            {/*post new news section*/}
            {isDev && <GenericMarkupSection title={"Add a new news post"}>
                <p>
                    You are an admin which means you are able to make new news posts right here. If you wish to do so
                    then please use the below form:
                </p>
                <FancyButton label={"Post new news"} onClick={() => setAddingNewNews(prev => !prev)} />
                <Suspense>
                    {addingNewNews && <NewNewsForm addNews={addNews}/>}
                </Suspense>
            </GenericMarkupSection>}
        </React.Fragment>
    )
}