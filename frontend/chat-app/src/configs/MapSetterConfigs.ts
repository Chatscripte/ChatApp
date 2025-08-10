import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl';
import type SDKMap from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';
import useLocation from '../hooks/useLocation';

const MapSetterConfigs = ( ) => {
    const { setCoordinates } = useLocation();
    const mapSetter = (neshanMap: SDKMap) => {
        // Create a popup
        const popup = new nmp_mapboxgl.Popup({ offset: 25 }).setText(
            'با نگه داشتن مارکر می‌توانید آن را روی نقشه جابه‌جا کنید'
        );

        // Add custom marker 
        const draggableMarker = new nmp_mapboxgl.Marker({
            color: '#00F955',
            draggable: true,
        })
            .setPopup(popup)
            .setLngLat([51.4055941, 35.70019216])
            .addTo(neshanMap)
            .togglePopup();

        // Attach dragend event to the draggable marker
        draggableMarker.on('dragend', function (e) {
            const lngLat = e?.target.getLngLat(); // Get marker's new position
            console.log('Marker dragend:', lngLat); // Debug
            setCoordinates({ lat: lngLat.lat, long: lngLat.lng });
        });

        neshanMap.on('click', function (e: { lngLat: any; }) {
            const coordinates = e.lngLat;
            setCoordinates({ lat: coordinates.lat, long: coordinates.lng });
        });

        neshanMap.on('load', function () {
            console.log('Map loaded');
            neshanMap.resize();
        });
    };
    return mapSetter
};

export default MapSetterConfigs