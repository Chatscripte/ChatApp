import '../styles/SelectLocationPopup.scss';
import { useShowPopups } from '../hooks/useShowPopups';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-react';
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../enums';
import { useChatContext } from '../hooks/useChatContext';
import MapSetterConfigs from '../configs/MapSetterConfigs';
import useLocation from '../hooks/useLocation';

function SelectLocationPopup() {
    const { isShowLocationPopup, setIsShowLocationPopup } = useShowPopups();
    const [showMap, setShowMap] = useState(false);
    const {  currentChatInfos } = useChatContext();
    const {coordinates} = useLocation();
    const handleClose = () => {
        setIsShowLocationPopup(false);
    };

    const sendLocation = () => {
        console.log(coordinates);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit(SOCKET_EVENTS.CHAT_SEND_MESSAGE, { chatID: currentChatInfos?.chatInfo?._id, location: coordinates }, (response: any) => {
            console.log('File sent successfully:', response);
            setIsShowLocationPopup(false);
        });
    }

    if (!isShowLocationPopup) return null;

    return (
        <div className="select-location-popup">
            <div className="popup-header">
                <h2>Select Location</h2>
                <CloseIcon className="close-icon" onClick={handleClose} />
            </div>
            {!showMap && (
                <div className="popup-content">
                    <img src="/map.png" alt="Map Preview" style={{ width: '200px', height: '200px' }} />
                    <button onClick={() => setShowMap(true)}>Select Location on Map</button>
                </div>
            )}
            {showMap && (
                <>
                    <MapComponent
                        options={{
                            mapKey: import.meta.env.VITE_NESHAN_API_KEY,
                            mapType: MapTypes.neshanRaster,
                            zoom: 11,
                            center: [51.389, 35.6892],
                        }}
                        mapSetter={MapSetterConfigs()}
                    />
                    <div className='send-location' onClick={sendLocation}>
                        <div className='location-details'>
                            <LocationOnIcon />
                        </div>
                        <span>send this location</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default SelectLocationPopup;