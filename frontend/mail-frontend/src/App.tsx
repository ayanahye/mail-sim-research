import {useEffect, useState} from 'react';

type ApiResponse = {
  message: string;
}

function App() {

  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.json())
      .then(data => setData(data));
      console.log(data)
  }, []);

  return (
    <div>
      <p>{data ? data.message : "Loading..."}</p>
    </div>
  )
}

export default App
