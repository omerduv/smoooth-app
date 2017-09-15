import React from 'react';
import './PersonList.css';

import PersonListItem from './PersonListItem.js';

const PersonList = ({persons, message}) =>
  (
    <div className="results">
      <div className="cui__selector--direct title">

        <h2 className="cui__selector--direct__title">
          {message}
        </h2>

      {persons.map(person => 
        <PersonListItem key={person.id} person={person} />
      )}

      </div>
    </div>
  );
  


export default PersonList;