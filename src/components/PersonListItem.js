import React from 'react';
import './PersonListItem.css';

// Get age from birthday in unix epoch. (Any values in the future return 1);
const getAge = (birthday) => {
  const receivedDate = new Date(birthday * 1000);
  const currentTime = Date.now();
  if (receivedDate > currentTime) {
    return 1;
  } else {
    const ageDiff = currentTime - receivedDate;
    const ageDate = new Date(ageDiff);
    return ageDate.getUTCFullYear() - new Date(0).getUTCFullYear();
  }
}

const getAddress = (address) => {
  return `${address.street}. ${address.city}, ${address.country}.`;
}

const PersonListItem = ({person}) =>
  (
    <div className="cui__selector--direct__item">
      <img className="user-avatar" src={person.picture} alt={person.name} />

      <div className="cui__selector--direct__label">
        {person.name} ({getAge(person.birthday)}), {person.phone}
      </div>

      <p className="cui__selector--direct__description">
        {getAddress(person.address)}
      </p>
    </div>
  );
  
export default PersonListItem;