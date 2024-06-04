import React, {FormEvent, useState} from 'react'
import './App.css'

// Компонент формы
const Form: React.FC<{onSearch: (type: string, value:string) => void}> = ({onSearch}) => {
  const [type, setType] = useState<string>('User');
  const [value, setValue] = useState<string>('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(type, value);
  }
  return(
    <form onSubmit={handleSearch}>
    <h1>Информация с Гита</h1>
    <input type='text' value={value} onChange={(e) => setValue(e.target.value)} placeholder='Введите ник или репозиторий'/>
    <select value={type} onChange={(e) => setType(e.target.value)}>
      <option value="User">Пользователь</option>
      <option value="Rep">Репозиторий</option>
    </select>
    <button type='submit'>отправить</button>
</form>
  )
} 

// Интрефейс для user
interface User{
  fullName: string;
  publicRepos: string;
}
// Интрефейс для rep
interface Repository{
  name: string;
  stargazersCount: number;
}

// Компонент результата
const Result: React.FC<{user?: User; rep?: Repository; error?: string}> = ({user, rep, error}) => {
  return (
    <div>
        {error && <div style={{ color: 'red' , textAlign: 'center'}}>{error}</div>}
        {user && (
        <div>
          <h2>Информация о пользователе</h2>
          <p>Полное Имя: {user.fullName}</p>
          <p>Количество публичных репозиториев: {user.publicRepos}</p>
        </div>
        )}
        {rep && (
          <div>
            <h2>Информация о репозиторие</h2>
            <p>Имя репозитория: {rep.name}</p>
            <p>Количество звёзд: {rep.stargazersCount}</p>
          </div>
        )}
    </div>

  )
}

// Основной компонент
export const App: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [rep, setRep] = useState<Repository | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSearch = async(type, value) =>{
    if (!value.trim()) {
      setError('Поля пусты. Пожалуйста, введите данные.');
      setUser(undefined);
      setRep(undefined);
      return;
    }
    setError('');

    try{
      if(type === 'User'){
        const res = await fetch(`https://api.github.com/users/${value}`);
        if(!res.ok){
          throw new Error('Пользователь не найден');
        }
        const data = await res.json();
        setUser({
          fullName: data.name,
          publicRepos: data.public_repos,
        })
        setRep(undefined);  
      }

      else if(type === 'Rep'){
        const res = await fetch(`https://api.github.com/repos/${value}`);
        if(!res.ok){
          throw new Error('Репозиторий не найден');
        }
        const data = await res.json();
        setRep({
          name: data.name,
          stargazersCount: data.stargazers_count,
        })
        setUser(undefined);  
      }

    }
    catch(error: any){
      setError(`Ошибка при получении данных: ` + error.message)
      setUser(undefined)
      setRep(undefined)
    }
  }

  return (
    <div>
      <Form onSearch={handleSearch}/>
      <Result user={user} rep={rep} error={error}/>
    </div>
  )
}
export default App;