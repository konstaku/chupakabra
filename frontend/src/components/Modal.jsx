import professions from '../data/professions.json';
import locations from '../data/locations.json';
import { useCallback, useEffect, useMemo } from 'react';
import { colorPalette } from './MasterCard';
import Avatar from './Avatar';

export default function Modal({ id, master, setShowModal }) {
  // I am using last two digits of an ID to derive a pseudorandom color for a card
  const randomAvatarColor = useMemo(() => {
    const seed = parseInt(id.slice(-2), 16) % colorPalette.length;
    return colorPalette[seed];
  }, [id]);

  console.log('Trying to show modal of master:', master);

  // Add card ID to address string, remove at unmount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('card', id);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);

    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete('card');
      window.history.pushState({}, '', `${window.location.pathname}`);
    };
  }, []);

  const generateContactLayout = useCallback(({ contactType, value }, index) => {
    let contactValue;
    let link;

    switch (contactType) {
      case 'instagram':
        link = `https://www.instagram.com/${value}/`;
        contactValue = <a href={link}>{value}</a>;
        break;
      case 'telegram':
        const handle = value.replace(/@/g, '');
        link = `https://t.me/${handle}`;
        contactValue = <a href={link}>{value}</a>;
        break;
      case 'phone':
        contactValue = <a href={`tel:${value}`}>{value}</a>;
        break;
      case 'facebook':
        contactValue = <a href={value}>link</a>;
        break;
      default:
        contactValue = value;
    }

    return (
      <div key={index}>
        <span className="contact-name">{contactType}:</span>
        <span className="contact-value">{contactValue}</span>
      </div>
    );
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-overlay-inside">
        <div className="modal-content" id="details-modal">
          <div
            className="master-card-body modal"
            style={{ backgroundColor: randomAvatarColor + '35' }}
          >
            <div>
              <div className="master-card-header">
                <Avatar
                  img={master.photo}
                  color={randomAvatarColor}
                  name={master.name}
                />
                <div
                  className="close-container"
                  onClick={() => setShowModal(null)}
                >
                  <img
                    src="/img/icons/close.svg"
                    alt="close"
                    style={{ width: '12px', height: '12px' }}
                  />
                </div>
              </div>
              <div className="master-card-name">{master.name}</div>
              <div className="master-card-profession">
                {professions.find((p) => p.id === master.professionID).name.ua}
              </div>
              <div className="mastercard-location">
                <img src="/img/icons/geopin.svg" alt="" />
                {locations.find((l) => l.id === master.locationID).city.ua}
              </div>
              <div className="mastercard-about">
                {master.about
                  ? master.about
                  : `Нажаль, майстер немає детального опису 🤷‍♂️`}
              </div>
            </div>

            <div className="mastercard-contacts">
              {master.contacts.map(generateContactLayout)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
