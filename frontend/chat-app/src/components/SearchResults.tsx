import { useState, useEffect } from 'react';
import { useChatContext } from '../hooks/useChatContext';
import ChatItem from './ChatItem';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';
import { postData } from '../data'
import { useDebounce } from 'use-debounce';
import UserSearchSkeleton from './UserSearchSkeleton';
import { Typography } from '@mui/material';

interface SearchResultsProps {
    query: string;
}

interface result {
    _id: string;
    title: string;
    exactMatch: boolean;
}

function SearchResults({ query}: SearchResultsProps) {
    const [results, setResults] = useState<result[]>([]);
    const [loading, setLoading] = useState(false);
    const { setIsSearchingChats, setChatInfo } = useChatContext();
    const [error, setError] = useState<Error | null>(null);
    const [debouncedQuery] = useDebounce(query, 2000);
    useEffect(() => {
        if (query) {
            setLoading(true);
        }
        if (!query) {
            setResults([]);
            setLoading(false);
        }
    }, [query]);
    useEffect(() => {
        if (!debouncedQuery) return;
        const searchData = async () => {
            setIsSearchingChats(true);
            try {
                const result = await postData(
                    `${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/search`,
                    { keyword: debouncedQuery }
                );
                setResults(result.data.chats);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false); // only this turns loading OFF
            }
        };
        searchData();
    }, [debouncedQuery]);

    if (!debouncedQuery) return null;
    if (error) return <p>Error: {error?.message}</p>;

    const getChatInfo = (chatID: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_GET_ONE, { chatID }, (data: any) => {
            if (data.success) {
                setChatInfo(data.chat);
            }
        });
    }

    return (
        <>
            {loading && <UserSearchSkeleton />}
            {!loading && results?.length > 0 && (
            <ul className='conversation-list' style={{ padding: '0px' }}>
                {results?.map((result, index) => (
                    <ChatItem
                        key={index}
                        conv={result}
                        getChatInfo={getChatInfo}
                    />
                ))}
            </ul>
            )}
            {!loading && results?.length === 0 && (
                <Typography variant='h6' color='#fff' textAlign='center'>No results found</Typography>
            )}
        </>
    );
}

export default SearchResults;