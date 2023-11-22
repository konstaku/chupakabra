import 'react-phone-input-2/lib/style.css';

import PhoneInput from 'react-phone-input-2';
import locations from './../data/locations.json';
import professions from './../data/professions.json';
import { useContext, useEffect, useRef, useState } from 'react';
import { MasterContext } from '../context';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import MasterCardPreview from '../components/MasterCardPreview';
import useAuthenticateUser from '../custom-hooks/useAuthenticateUser';

export default function AddNewRecord() {
  const { state, dispatch } = useContext(MasterContext);
  const { user } = state;
  const { firstName, username } = user;
  const { register, handleSubmit, setValue, control, watch } = useForm({});

  // Fetch photo dynamically
  const { photo } = useAuthenticateUser();

  // Get live updates from all fields
  const watcher = watch();

  // As user name is updated in state, update form default value as state changes
  useEffect(() => {
    setValue('telegram', username);
    setValue('name', firstName);
  }, [username, firstName]);

  // Card preview, with up-to-date data via watcher
  const masterPreview = {
    photo,
    watcher,
  };

  // Post form on submit
  const onSubmit = (data) => {
    console.log(data);
    if (user.isAdmin) {
      console.log('✨ You are admin! ✨');
    } else {
      console.log('You are not admin (((');
    }
    fetch('https://api.konstaku.com:5000/addmaster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return console.log('Data submitted successfully');
        }
        return Promise.reject(response);
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="create-user-container">
        {/* Form */}
        <div className="create-user-form">
          <div className="create-record-header">
            <h2>Створити запис:</h2>
          </div>
          <form id="add-new-piggy" onSubmit={handleSubmit(onSubmit)}>
            <PhotoInput photo={photo} register={register} />
            <NameInput register={register} />
            <ProfessionInput control={control} professions={professions} />
            <LocationInput control={control} locations={locations} />
            <TagsInput control={control} tags={watcher.tags} />
            <TelephoneInput register={register} control={control} />
            <InstagramInput register={register} />
            <TelegramInput register={register} />
            <AboutInput register={register} />
            <button type="submit">Створити запис</button>
          </form>
        </div>
        {/* Card preview */}
        <MasterCardPreview
          className="master-preview-container"
          master={masterPreview}
        />
      </div>
    </>
  );
}

function PhotoInput({ photo, register }) {
  return (
    photo && (
      <>
        <div
          className="create-user-photo"
          style={{
            backgroundImage: `url(${photo})`,
          }}
        ></div>
        <label>
          <input {...register('useThisPhoto')} type="checkbox" defaultChecked />
          Використати це фото
        </label>
      </>
    )
  );
}

function NameInput({ register }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Ваше імʼя:</div>
        <input
          className="create-user-input"
          placeholder="Ваше імʼя"
          {...register('name', {
            required: true,
          })}
        />
      </label>
    </div>
  );
}

function LocationInput({ control, locations }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Оберіть найближче велике місто.</div>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange } }) => (
            <Select
              onChange={(e) => {
                // Important to call the original onChange provided by Controller
                onChange(e.value);
              }}
              options={locations.map((location) => ({
                value: location.id,
                label: location.city.ua,
              }))}
            />
          )}
        />
      </label>
    </div>
  );
}

function ProfessionInput({ control, professions }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Оберіть професію зі списку</div>
        <Controller
          control={control}
          name="profession"
          render={({ field: { onChange } }) => (
            <Select
              onChange={(e) => {
                // Important to call the original onChange provided by Controller
                onChange(e.value);
              }}
              options={professions.map((profession) => ({
                value: profession.id,
                label: profession.name.ua,
              }))}
            />
          )}
        />
      </label>
    </div>
  );
}

function TagsInput({ control, tags = [] }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">
          Вкажіть до 3х тегів (наприклад "Ламінування", "Корекція брів",
          "Кератин")
        </div>
        <Controller
          control={control}
          name="tags"
          render={({ field: { onChange } }) => (
            <CreatableSelect
              isValidNewOption={() => tags.length < 3}
              onChange={onChange}
              isMulti
            />
          )}
        />
      </label>
    </div>
  );
}

function TelephoneInput({ register, control }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Ваш номер телефону</div>

        <Controller
          control={control}
          name="telephone"
          render={({ field: { onChange } }) => (
            <PhoneInput
              country={'it'}
              countryCodeEditable
              enableSearch
              onChange={onChange}
            ></PhoneInput>
          )}
        />
        <div className="contact-type-container">
          <label>
            <input
              type="checkbox"
              {...register('isTelephone')}
              defaultChecked
            />
            Телефон
          </label>
          <label>
            <input type="checkbox" {...register('isWhatsapp')} />
            Whatsapp
          </label>
          <label>
            <input type="checkbox" {...register('isViber')} />
            Viber
          </label>
        </div>
      </label>
    </div>
  );
}

function InstagramInput({ register }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Instagram: </div>
        <input className="create-user-input" {...register('instagram')} />
      </label>
    </div>
  );
}

function TelegramInput({ register }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Telegram:</div>
        <input className="create-user-input" {...register('telegram')} />
      </label>
    </div>
  );
}

function AboutInput({ register }) {
  return (
    <div className="input-field">
      <label>
        <div className="input-label">Інформація про вас</div>
        <textarea
          {...register('about')}
          className="create-user-input"
          cols="30"
          rows="6"
        ></textarea>
      </label>
    </div>
  );
}
