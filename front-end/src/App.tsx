import React, { FormEvent, useState } from 'react';
import {
  useAddMessageMutation,
  useGetMessagesQuery,
} from './graphql/message.generated';
import logo from './logo.svg';

function App() {
  const [newMessage, setNewMessage] = useState({ value: '' });
  const { data, refetch } = useGetMessagesQuery();
  const [addMessage] = useAddMessageMutation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({ value: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.value) {
      await addMessage({ variables: { url: newMessage.value } });
      setNewMessage({ value: '' });
      await refetch();
    }
  };

  // TODO Use READ-ONLY/WRITE-ONLY DTO to make shortUrl not optional on READ-ONLY

  return (
    <div className="bg-main-blue min-h-screen">
      <header className="container mx-auto py-14 flex justify-between">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="text-white font-bold text-2xl">
          URL shortener
        </h1>
      </header>
      <section className="container mx-auto py-8">
        <div
          data-cy="messageContainer"
          className="p-8 flex flex-col gap-6 items-center bg-white rounded-2xl"
        >
          <div
            className="font-semibold text-xl"
          >
            Your shortened URLs :
          </div>
          {data?.urls.map((url) => (
            <div key={url.id}>
              <a href={url.url} rel="noreferrer" target="_blank">{url.url}</a>
              :
              {' '}
              <a href={url.shortUrl ?? '#'} rel="noreferrer" target="_blank">{url.shortUrl}</a>
            </div>
          ))}
          <div className="font-semibold">
            <form
              className="flex gap-4"
              onSubmit={onSubmit}
            >
              <input
                data-cy="messageInput"
                placeholder="Your so much too long URL ..."
                className="p-3 w-96 border-2 rounded-full border-main-blue"
                value={newMessage.value}
                onChange={onChange}
              />
              <button
                data-cy="submit"
                type="submit"
                className="p-3 bg-main-blue text-white rounded-full"
              >
                Get your shortened URL
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
