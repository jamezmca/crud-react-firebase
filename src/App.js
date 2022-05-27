import React, { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, setDoc, updateDoc, deleteField, getDoc } from 'firebase/firestore'

function App() {
  const [people, setPeople] = useState([])
  const [friendName, setFriendName] = useState('')
  const friends = people.filter(val => val.status === 'friend')
  const enemies = people.filter(val => val.status === 'enemy')

  useEffect(() => {
    async function fetchPeople() {
      try {
        const docRef = doc(db, 'people', 'associates')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          console.log(docSnap.data())
          setPeople(Object.keys(docSnap.data()).map(key => ({ name: key, status: docSnap.data()[key] })))
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPeople()

  }, [])

  async function handleAdd() {
    console.log('here')
    setPeople([...people, { name: friendName, status: 'friend' }])
    const peopleRef = doc(db, 'people', 'associates')
    await setDoc(peopleRef, {
      [friendName]: 'friend'
    }, { merge: true })
  }

  async function handleChange(name, currStatus) {
    setPeople([...people.filter(val => val.name !== name), { name, status: currStatus }])
    const peopleRef = doc(db, 'people', 'associates')
    await setDoc(peopleRef, {
      [friendName]: currStatus
    }, { merge: true })
  }

  async function handleDelete(name, currStatus) {
    setPeople([...people.filter(val => val.name !== name)])
    const peopleRef = doc(db, 'people', 'associates')
    await updateDoc(peopleRef, {
      [friendName]: deleteField()
    })
  }

  return (
    <div className="App min-h-screen text-white flex gap-10 flex-col bg-slate-900">
      <div className="flex items-stretch">
        <input value={friendName} placeholder="friend" onChange={(e) => setFriendName(e.target.value)} className="bg-white text-slate-900 p-3 uppercase outline-none flex-1" type="text" />
        <div className="bg-amber-500 text-white grid place-items-center px-8 cursor-pointer duration-300 hover:bg-amber-300 font-medium" onClick={handleAdd}>ADD</div>
      </div>
      <div className="grid text-center grid-cols-2 gap-2 px-10">
        <div className="flex flex-col gap-3">
          <h1>FRIENDS</h1>
          <ul className='disc text-left flex flex-col gap-2'>
            {friends.map((friend, i) => {
              return <li className='flex items-stretch justify-between' key={i}>
                <p>{friend.name}</p>
                <div onClick={() => handleChange(friend.name, 'enemy')} className='text-rose-500'>BAD</div>
                <div onClick={() => handleDelete(friend.name, friend.status)}>del</div>
              </li>
            })}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h1>ENEMIES</h1>
          <ul className='disc text-left flex flex-col gap-2'>
            {enemies.map((enemy, i) => {
              return <li className='flex items-stretch justify-between' key={i}>
                <p>{enemy.name}</p>
                <div onClick={() => handleChange(enemy.name, 'friend')} className='text-emerald-400'>GOOD</div>
                <div onClick={() => handleDelete(enemy.name, enemy.status)}>del</div>
              </li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
