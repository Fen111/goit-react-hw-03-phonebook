import React, { Component } from 'react';
import { nanoid } from 'nanoid';

import initialState from '../../data/contacts.json';
import Container from '../Container/Container';
import ContactForm from 'components/ContactForm';
import Filter from 'components/Filter';
import ContactList from 'components/ContactList';

export default class App extends Component {
  state = {
    contacts: initialState,
    filter: '',
  };

  #localStorageKey = 'contacts';

  componentDidMount() {
    const localStorageContacts = localStorage.getItem(this.#localStorageKey);
    const contacts = JSON.parse(localStorageContacts);

    if (contacts) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;

    if (contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  formSubmitHandler = data => {
    const { contacts } = this.state;

    if (contacts.some(({ name }) => name === data.name)) {
      alert(`${data.name} is already in contacts!`);
      return;
    } else if (contacts.some(({ number }) => number === data.number)) {
      alert(`${data.number} is already in contacts!`);
      return;
    }

    const { name, number } = data;

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(({ contacts }) => ({
      contacts: [newContact, ...contacts],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const lowerCaseFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowerCaseFilter),
    );
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter} />
        <ContactList
          contacts={visibleContacts}
          onDeleteContact={this.deleteContact}
        />
      </Container>
    );
  }
}
