'use client';
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet';
import { Button, Input, Form, FormInstance } from 'antd';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './map.css';
import { DeceasedInfoModel } from '@/app/models/Deceased/DeceasedInfoModel';

interface LocationMarkerProps {
  position: [number, number] | null;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} icon={L.icon({ iconUrl: '/marker-24.png' })} />;
};

const MapClickHandler: React.FC<{
  setPosition: (pos: [number, number]) => void;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}> = ({ setPosition, setLatitude, setLongitude }) => {
  useMapEvent('click', (event) => {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    setPosition([lat, lng]);
    setLatitude(lat);
    setLongitude(lng);
    // console.log('latitude:', lat);
    // console.log('longitude:', lng);
  });
  return null;
};

interface Props {
  form: FormInstance<DeceasedInfoModel>;
  latitude: number;
  setLatitude: (lat: number) => void;
  longitude: number;
  setLongitude: (lng: number) => void;
}
const MyMap: React.FC<Props> = (props) => {
  const [position, setPosition] = useState<[number, number] | null>([props.latitude, props.longitude]);

  const handleLocate = () => {
    setPosition([props.latitude, props.longitude]);
  };

  useEffect(() => {
    setPosition([props.latitude, props.longitude]);
    // // چک کردن پشتیبانی مرورگر از Geolocation API
    // console.log('props.latitudeprops.latitude::', props.latitude);
    // // if (props.latitude === 0 && props.longitude === 0) {
    // if (navigator.geolocation) {
    //   console.log('ddddddddddddddddddddddd');
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const lat = position.coords.latitude;
    //       const lon = position.coords.longitude;
    //       // props.setLatitude(lat);
    //       // props.setLongitude(lon);
    //       setPosition([lat, lon]);
    //       // console.log('lat:', lat);
    //       // console.log('lon:', lon);
    //     },
    //     (error) => {
    //       //console.error('Error getting geolocation:', error);
    //       console.error('خطا در دریافت مختصات', error);
    //       setPosition([38.04049512038982, 46.21905326843262]);
    //     }
    //   );
    // } else {
    //   //alert('Geolocation is not supported by this browser.');
    //   alert('مختصات توسط این مرورگر پشتیبانی نمیشود');
    //   setPosition([38.04049512038982, 46.21905326843262]);
    // }
    // // } else {
    // //   setPosition([props.latitude, props.longitude]);
    // // }
  }, []);

  useEffect(() => {
    setPosition([props.latitude, props.longitude]);
  }, [props.latitude | props.longitude]);

  return (
    <div>
      <Input type="number" placeholder="عرض جغرافیایی" value={props.latitude} style={{ width: '250px', display: 'none' }} />

      <Input type="number" placeholder="طول جغرافیایی" value={props.longitude} style={{ width: '250px', display: 'none' }} />

      {/* <Button type="primary" onClick={handleLocate} hidden>
        نشان دادن مکان
      </Button> */}

      <MapContainer center={[props.latitude, props.longitude]} zoom={15} className="map-div">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <MapClickHandler setPosition={setPosition} setLatitude={props.setLatitude} setLongitude={props.setLongitude} />
        <LocationMarker position={position} />
      </MapContainer>
    </div>
  );
};

export default MyMap;
