import { useState, useEffect } from 'react';
import { postData } from '../data';
import { useChatContext } from '../hooks/useChatContext';
import ChatItem from './ChatItem';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';

interface SearchResultsProps {
    query: string;
}

interface result {
    _id: string;
    title: string;
    exactMatch: boolean;
}

function SearchResults({ query }: SearchResultsProps) {
    const [results, setResults] = useState<result[]>([]);
    const [loading, setLoading] = useState(false);
    const { setIsSearchingChats, setChatInfo } = useChatContext();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!query) return;
        setIsSearchingChats(true);
        setLoading(true);
        const timeout = setTimeout(() => {
            postData(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/chat/search`, { keyword: query })
                .then(result => {
                    setResults(result.data)
                })
                .catch(err => {
                    setError(err)
                })
                .finally(() => {
                    setLoading(false)
                });
        }, 5000);
        // If no results after 5 seconds, stop loading
        if (results.length === 0 && !loading) {
            if (results.length === 0) {
                setLoading(false)
            }
        }
        return () => {
            clearTimeout(timeout);
        }
    }, [query]);

    if (!query) return null;
    if (error) return <p>Error: {error?.message}</p>;
    if (loading) return <h2 style={{ color: 'white' }}>در حال بارگیری...</h2>;

    // Function to get chat information
    const getChatInfo = (chatID: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_GET_ONE, { chatID }, (data: any) => {
            if (data.success) {
                setChatInfo(data.chat);
            }
        });
    }

    return (
        <ul className='conversation-list' style={{ padding: '0px' }}>
            {results?.map((result, index) => (
                <ChatItem
                    key={index}
                    conv={result}
                    getChatInfo={getChatInfo}
                />
            ))}
            {results.length === 0 && (
                <h3 style={{ color: 'white', textAlign: 'center' }}>chat not found !!</h3>
            )}
        </ul>
    );
}

export default SearchResults;